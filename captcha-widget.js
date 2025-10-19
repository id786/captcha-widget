/**
 * CustomCaptcha - Updated CAPTCHA with multiple verification types
 * Enhanced version with image selection, slide puzzle, and image click CAPTCHAs
 */
class CustomCaptcha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.instanceId = containerId.replace('captcha-container-', '') || '1';
        this.isVerified = false;
        
        if (!this.container) {
            console.error('CAPTCHA container not found:', containerId);
            return;
        }
        
        this.init();
    }

    init() {
        this.createCaptcha();
        this.bindEvents();
        this.initializeCaptchaData();
    }

    createCaptcha() {
        this.container.innerHTML = `
            <style>
                .x1a2b3cgic-${this.instanceId} {
                    width: 304px;
                    height: 78px;
                    border: 1.5px solid #dcdcdc;
                    border-radius: 4px;
                    background: #fff;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    box-sizing: border-box;
                    overflow: hidden;
                    background: #f9f9f9;
                }

                .y4d5e6fgic-${this.instanceId} {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .z7g8h9igic-${this.instanceId} {
                    width: 24px;
                    height: 24px;
                    border: 2px solid #c1c1c1;
                    border-radius: 2px;
                    background: #fff;
                    cursor: pointer;
                    position: relative;
                }

                .z7g8h9igic-${this.instanceId}.j1k2l3mgic-${this.instanceId} {
                    border: 1.5px solid red;
                }

                .a1b2c3dgic-${this.instanceId} {
                    font-size: 14px;
                    color: #000;
                }

                .tick-animgic-${this.instanceId} {
                    width: 40px;
                    height: 40px;
                    stroke: #4CAF50;
                    stroke-width: 3;
                    fill: none;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 50;
                    stroke-dashoffset: 50;
                    animation: drawgic-${this.instanceId} 0.8s ease forwards;
                }

                @keyframes drawgic-${this.instanceId} {
                    from { stroke-dashoffset: -50; }
                    to { stroke-dashoffset: 0; }
                }

                .e4f5g6hgic-${this.instanceId} {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 10px;
                    color: #555;
                }

                .i7j8k9lgic-${this.instanceId} {
                    width: 33px;
                    height: 33px;
                    margin-bottom: 2px;
                    background: red;
                }

                .e4f5g6hgic-${this.instanceId} strong {
                    font-size: 12px;
                }

                .x1a2b3cgic-${this.instanceId}.loading-stategic-${this.instanceId} {
                    border: 1.5px solid gold;
                }

                .x1a2b3cgic-${this.instanceId}.success-stategic-${this.instanceId} {
                    border: 1.5px solid #00ad00;
                }

                .x1a2b3cgic-${this.instanceId}.failed-stategic-${this.instanceId} {
                    border: 1.5px solid red;
                }

                .modal-containergic-${this.instanceId} {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(3px);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .a1b2c3dgic-${this.instanceId}.failed-textgic-${this.instanceId} {
                    color: red;
                }

                .a1b2c3dgic-${this.instanceId}.loading-textgic-${this.instanceId} {
                    color: gold;
                }

                .a1b2c3dgic-${this.instanceId}.success-textgic-${this.instanceId} {
                    color: green;
                }

                .modal-headergic-${this.instanceId} {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    margin: -20px -20px 20px -20px;
                    padding: 15px 20px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                }

                .modal-headergic-${this.instanceId} p {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                    font-weight: 500;
                }

                .image-gridgic-${this.instanceId} {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 5px;
                    width: 300px;
                    height: 300px;
                    aspect-ratio: 1;
                }

                .image-containergic-${this.instanceId} {
                    transition: all 0.2s ease;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-containergic-${this.instanceId}.selectedgic-${this.instanceId} .captcha-imagegic-${this.instanceId} {
                    border: 3px solid #4CAF50 !important;
                    transform: scale(0.85);
                }

                .image-containergic-${this.instanceId}.incorrectgic-${this.instanceId} .captcha-imagegic-${this.instanceId} {
                    border: 3px solid #f44336 !important;
                    transform: scale(0.85);
                }

                .captcha-imagegic-${this.instanceId} {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                    border: none;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    transform-origin: center center;
                }

                .verify-btngic-${this.instanceId} {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: #333;
                    border: none;
                    padding: 12px 40px;
                    border-radius: 25px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                }

                .verify-btngic-${this.instanceId}:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
                }

                .verify-btngic-${this.instanceId}:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
                }

                .slide-puzzle-containergic-${this.instanceId} {
                    text-align: center;
                    width: 100%;
                    max-width: 350px;
                    margin: 0 auto;
                }

                .puzzle-imagegic-${this.instanceId} {
                    width: 100%;
                    height: 150px;
                    background: #f8f9f9;
                    border: 2px solid #e9ecef;
                    border-radius: 15px;
                    margin: 0 auto 20px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .puzzle-trackgic-${this.instanceId} {
                    position: absolute;
                    left: 20px;
                    right: 20px;
                    top: 40px;
                    height: 60px;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                }

                .random-shapegic-${this.instanceId} {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    border-radius: 8px;
                    transition: transform 0.1s ease;
                    position: absolute;
                    left: 10px;
                }

                .puzzle-targetgic-${this.instanceId} {
                    width: 40px;
                    height: 40px;
                    background: rgba(76, 175, 80, 0.3);
                    border: 2px dashed #4CAF50;
                    border-radius: 8px;
                    animation: pulsegic-${this.instanceId} 2s infinite;
                    position: absolute;
                }

                .random-shapegic-${this.instanceId}.circlegic-${this.instanceId} {
                    border-radius: 50%;
                    background: linear-gradient(135deg, #FF6B6B, #EE5A24);
                }

                .random-shapegic-${this.instanceId}.trianglegic-${this.instanceId} {
                    width: 0;
                    height: 0;
                    background: none;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 35px solid #48dbfb;
                }

                .random-shapegic-${this.instanceId}.diamondgic-${this.instanceId} {
                    transform: rotate(45deg);
                    background: linear-gradient(135deg, #1dd1a1, #10ac84);
                }

                .puzzle-targetgic-${this.instanceId}.circlegic-${this.instanceId} {
                    border-radius: 50%;
                }

                .puzzle-targetgic-${this.instanceId}.trianglegic-${this.instanceId} {
                    width: 0;
                    height: 0;
                    background: none;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 35px solid rgba(76, 175, 80, 0.3);
                }

                .puzzle-targetgic-${this.instanceId}.diamondgic-${this.instanceId} {
                    transform: rotate(45deg);
                }

                .puzzle-slider-containergic-${this.instanceId} {
                    position: absolute;
                    left: 20px;
                    right: 20px;
                    bottom: 15px;
                    height: 30px;
                    background: #e9ecef;
                    border-radius: 15px;
                    border: 2px solid #dee2e6;
                    padding: 0 5px;
                    box-sizing: border-box;
                }

                .puzzle-slidergic-${this.instanceId} {
                    width: 50px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 8px;
                    position: absolute;
                    left: 5px;
                    top: -5px;
                    cursor: grab;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    transition: transform 0.1s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                    box-sizing: border-box;
                }

                .slider-handlegic-${this.instanceId} {
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }

                .puzzle-slidergic-${this.instanceId}:active {
                    cursor: grabbing;
                    transform: scale(0.95);
                }

                .puzzle-instructionsgic-${this.instanceId} {
                    margin-top: 15px;
                    color: #666;
                    font-size: 14px;
                    text-align: center;
                    padding: 0 10px;
                }

                .captcha-typegic-${this.instanceId} {
                    transition: opacity 0.3s ease;
                }

                @keyframes pulsegic-${this.instanceId} {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                .loading-bar-containergic-${this.instanceId} {
                    width: 100%;
                    height: 3px;
                    background: #f0f0f0;
                    border-radius: 2px;
                    overflow: hidden;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    display: none; 
                }

                .loading-bar-containergic-${this.instanceId}.activegic-${this.instanceId} {
                    display: block; 
                }

                .loading-bargic-${this.instanceId} {
                    height: 100%;
                    background: linear-gradient(90deg, #FFD700, #FFA500);
                    border-radius: 2px;
                    width: 30%;
                    animation: infiniteSlidegic-${this.instanceId} 1.5s infinite linear;
                    transform: translateX(-100%);
                }

                @keyframes infiniteSlidegic-${this.instanceId} {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }

                .close-buttongic-${this.instanceId} {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    cursor: pointer;
                    font-size: 18px;
                    z-index: 1001;
                }

                .number-markergic-${this.instanceId} {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    font-weight: bold;
                    font-size: 14px;
                    z-index: 10;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                }

                .modal-contentgic-${this.instanceId} {
                    background: #fff;
                    padding: 20px;
                    border-radius: 6px;
                    width: 90%;
                    max-width: 300px;
                    text-align: center;
                    position: relative;
                    margin: auto;
                }

                .close-buttongic-${this.instanceId} {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    cursor: pointer;
                    font-size: 18px;
                    z-index: 1001;
                    background: none;
                    border: none;
                    color: #333;
                }

                .modal-bodygic-${this.instanceId} {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 0;
                    min-height: 300px;
                }

                .modal-footergic-${this.instanceId} {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .image-click-containergic-${this.instanceId} {
                    text-align: center;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .click-image-wrappergic-${this.instanceId} {
                    position: relative;
                    display: inline-block;
                    margin: 0 auto;
                    cursor: crosshair;
                }

                .click-imagegic-${this.instanceId} {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    display: block;
                    margin: 0 auto;
                }

                .refresh-buttongic-${this.instanceId} {
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    transition: all 0.3s ease;
                    border-radius: 50%;
                    margin-right: 10px;
                }

                .refresh-buttongic-${this.instanceId}:hover {
                    color: #333;
                    background: rgba(0,0,0,0.05);
                    transform: rotate(180deg);
                }

                .refresh-buttongic-${this.instanceId}:active {
                    transform: rotate(360deg);
                }

                .puzzle-slidergic-${this.instanceId}.activegic-${this.instanceId} {
                    transform: scale(0.95);
                    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                }
            </style>

            <div class="x1a2b3cgic-${this.instanceId}" id="captchaContainergic-${this.instanceId}">
                <div class="y4d5e6fgic-${this.instanceId}">
                    <div class="z7g8h9igic-${this.instanceId}" id="verifyTriggergic-${this.instanceId}"></div>
                    <span class="a1b2c3dgic-${this.instanceId}" id="statusTextgic-${this.instanceId}">I'm not a robot</span>
                </div>
                <div class="e4f5g6hgic-${this.instanceId}">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="33px" height="33px" viewbox="330 330 1350 1350" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <!-- Your SVG content here (same as original) -->
                        <g><path style="opacity:0.852" fill="#ffd500" d="M 1140.5,324.5 C 1172.5,324.333 1204.5,324.5 1236.5,325C 1279.63,325.886 1322.63,327.219 1365.5,329C 1372.84,332.843 1375.34,338.676 1373,346.5C 1370.43,348.647 1368.59,351.314 1367.5,354.5C 1168.75,553.581 969.752,752.248 770.5,950.5C 769.024,953.143 767.024,955.31 764.5,957C 767.447,957.112 768.78,958.612 768.5,961.5C 769.978,961.238 771.311,961.571 772.5,962.5C 794.018,977.512 815.685,992.346 837.5,1007C 848.843,1015.34 860.177,1023.67 871.5,1032C 881.116,1037.64 890.45,1043.64 899.5,1050C 900.337,1051.01 900.67,1052.18 900.5,1053.5C 901.873,1053.34 903.207,1053.51 904.5,1054C 989.258,1113.22 1074.26,1172.22 1159.5,1231C 1160.34,1232.01 1160.67,1233.18 1160.5,1234.5C 1163.74,1234.88 1166.74,1236.05 1169.5,1238C 1184.98,1249.82 1200.98,1260.82 1217.5,1271C 1218.38,1272.36 1218.71,1273.86 1218.5,1275.5C 1219.5,1275.5 1220.5,1275.5 1221.5,1275.5C 1221.66,1272.81 1221.5,1270.15 1221,1267.5C 1214.84,1246.21 1208.84,1224.88 1203,1203.5C 1200.01,1189.13 1196.85,1174.8 1193.5,1160.5C 1190.34,1155.38 1188.67,1149.71 1188.5,1143.5C 1187.81,1141.73 1186.98,1140.06 1186,1138.5C 1183.16,1123.85 1179.99,1109.19 1176.5,1094.5C 1175.04,1092.72 1173.88,1090.72 1173,1088.5C 1169.72,1072.11 1166.05,1055.77 1162,1039.5C 1160.45,1033.63 1158.45,1027.97 1156,1022.5C 1152.25,1006.13 1148.59,989.795 1145,973.5C 1144.33,972.833 1143.67,972.167 1143,971.5C 1138.9,952.966 1134.23,934.633 1129,916.5C 1128.67,913.5 1128.33,910.5 1128,907.5C 1126.18,905.084 1124.85,902.418 1124,899.5C 1120.98,883.312 1117.48,867.312 1113.5,851.5C 1113.69,848.351 1114.69,845.518 1116.5,843C 1170.5,842.333 1224.5,842.333 1278.5,843C 1281.69,844.087 1285.02,844.92 1288.5,845.5C 1290.33,847.166 1291.67,849.166 1292.5,851.5C 1297.27,867.342 1301.1,883.342 1304,899.5C 1308.63,912.292 1312.63,925.292 1316,938.5C 1315.77,944.34 1317.1,949.674 1320,954.5C 1320.49,959.933 1321.49,965.267 1323,970.5C 1324.73,976.295 1326.73,981.961 1329,987.5C 1332.07,1001.41 1335.07,1015.41 1338,1029.5C 1339.89,1031.48 1341.22,1033.82 1342,1036.5C 1345.07,1050.41 1348.07,1064.41 1351,1078.5C 1353.18,1086.66 1355.85,1094.66 1359,1102.5C 1365.65,1128.75 1372.32,1155.08 1379,1181.5C 1380,1183.83 1381,1186.17 1382,1188.5C 1383.49,1196.94 1385.16,1205.28 1387,1213.5C 1390.09,1221.42 1392.76,1229.42 1395,1237.5C 1396.72,1246.51 1398.56,1255.51 1400.5,1264.5C 1402.97,1269.12 1404.14,1274.12 1404,1279.5C 1405.77,1281.58 1407.1,1283.92 1408,1286.5C 1410.98,1302.75 1414.65,1318.75 1419,1334.5C 1421.2,1340.09 1423.2,1345.76 1425,1351.5C 1432.87,1383.44 1440.87,1415.44 1449,1447.5C 1451.41,1455.51 1454.08,1463.51 1457,1471.5C 1457.33,1474.83 1457.67,1478.17 1458,1481.5C 1461.71,1491.89 1464.37,1502.55 1466,1513.5C 1466.77,1516.48 1468.1,1519.15 1470,1521.5C 1473.08,1535.15 1476.08,1548.82 1479,1562.5C 1488.84,1594.01 1497.34,1625.84 1504.5,1658C 1501.47,1673.18 1492.8,1677.85 1478.5,1672C 1439.28,1643.57 1399.61,1615.9 1359.5,1589C 1358.66,1587.99 1358.33,1586.82 1358.5,1585.5C 1355.76,1584.61 1353.09,1583.45 1350.5,1582C 1336.92,1572.62 1323.42,1563.12 1310,1553.5C 1309.52,1552.55 1309.35,1551.55 1309.5,1550.5C 1306.59,1550.42 1303.93,1549.59 1301.5,1548C 1237.36,1501.85 1172.69,1456.51 1107.5,1412C 1102.94,1407.91 1098.27,1404.07 1093.5,1400.5C 1066.59,1382.56 1039.93,1364.39 1013.5,1346C 1005.57,1339.56 997.233,1333.73 988.5,1328.5C 987.614,1327.68 987.281,1326.68 987.5,1325.5C 975.554,1318.85 964.221,1311.18 953.5,1302.5C 947.64,1299.97 942.64,1296.3 938.5,1291.5C 924.938,1283.26 911.938,1274.26 899.5,1264.5C 874.578,1247.92 849.911,1230.92 825.5,1213.5C 824.147,1212.48 823.48,1211.14 823.5,1209.5C 822.127,1209.66 820.793,1209.49 819.5,1209C 758.262,1166.01 697.095,1123.18 636,1080.5C 635.517,1079.55 635.351,1078.55 635.5,1077.5C 626.189,1073.89 617.856,1068.55 610.5,1061.5C 601.675,1057.01 593.675,1051.34 586.5,1044.5C 578.641,1040.07 571.307,1034.9 564.5,1029C 559.136,1025.93 553.803,1022.76 548.5,1019.5C 537.794,1011.49 527.127,1003.49 516.5,995.5C 505.85,992.032 499.85,984.866 498.5,974C 499.264,970.041 500.431,966.208 502,962.5C 715.089,749.911 927.922,537.245 1140.5,324.5 Z"/></g>
                        <!-- Additional SVG paths... -->
                    </svg>
                    <strong>gCaptcha</strong>
                    <a href="#" style="text-decoration:none;color:default;"><small>Free Captcha Here</small></a>
                </div>

                <div class="loading-bar-containergic-${this.instanceId}">
                    <div class="loading-bargic-${this.instanceId}" id="loadingBargic-${this.instanceId}"></div>
                </div>
            </div>

            
            <!-- Modal -->
            <div class="modal-containergic-${this.instanceId}" id="verificationModalgic-${this.instanceId}">
                <div class="modal-contentgic-${this.instanceId}">
                    <span class="close-buttongic-${this.instanceId}" id="modalClosegic-${this.instanceId}">&times;</span>

                    <!-- CAPTCHA Type 1: Image Selection -->
                    <div id="captchaType1gic-${this.instanceId}" class="captcha-typegic-${this.instanceId}">
                        <div class="modal-headergic-${this.instanceId}">
                            <span><p>Select all the images</p><b style="font-size:1.5em;">That can fit</b><p>Into the box</p></span>
                            <span><img src="https://i.postimg.cc/hP8RndLD/download.jpg" alt="" class="img-boxgic-${this.instanceId}" style="height: 70px; width:70px; align-self: center;"></span>
                        </div>

                        <div class="modal-bodygic-${this.instanceId}">
                            <div class="image-gridgic-${this.instanceId}" id="captchaGridgic-${this.instanceId}"></div>
                        </div>

                        <div class="modal-footergic-${this.instanceId}">
                            <button id="completeVerificationgic-${this.instanceId}" class="verify-btngic-${this.instanceId}">Verify</button>
                            <button class="refresh-buttongic-${this.instanceId}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- CAPTCHA Type 2: Slide Puzzle -->
                    <div id="captchaType2gic-${this.instanceId}" class="captcha-typegic-${this.instanceId}" style="display: none;">
                        <div class="modal-headergic-${this.instanceId}">
                            <p>Drag the shape to match the target position</p>
                        </div>

                        <div class="modal-bodygic-${this.instanceId}">
                            <div class="slide-puzzle-containergic-${this.instanceId}">
                                <div class="puzzle-imagegic-${this.instanceId}" id="puzzleImagegic-${this.instanceId}">
                                    <div class="puzzle-trackgic-${this.instanceId}">
                                        <div class="random-shapegic-${this.instanceId}" id="randomShapegic-${this.instanceId}"></div>
                                        <div class="puzzle-targetgic-${this.instanceId}" id="puzzleTargetgic-${this.instanceId}"></div>
                                    </div>
                                    <div class="puzzle-slider-containergic-${this.instanceId}">
                                        <div class="puzzle-slidergic-${this.instanceId}" id="puzzleSlidergic-${this.instanceId}">
                                            <div class="slider-handlegic-${this.instanceId}">⇄</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="puzzle-instructionsgic-${this.instanceId}">
                                    <p>Drag the slider to align the shape with the target</p>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footergic-${this.instanceId}">
                            <button id="verifySlidePuzzlegic-${this.instanceId}" class="verify-btngic-${this.instanceId}">Verify</button>
                            <button class="refresh-buttongic-${this.instanceId}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- CAPTCHA Type 3: Image Click in Order -->
                    <div id="captchaType3gic-${this.instanceId}" class="captcha-typegic-${this.instanceId}" style="display: none;">
                        <div class="modal-bodygic-${this.instanceId}">
                            <div class="image-click-containergic-${this.instanceId}">
                                <div class="click-image-wrappergic-${this.instanceId}">
                                    <img src="https://i.postimg.cc/Z5NxCx71/Picsart-25-10-03-07-50-10-932.jpg" alt="Find objects" class="click-imagegic-${this.instanceId}">
                                </div>
                            </div>
                        </div>

                        <div class="modal-footergic-${this.instanceId}">
                            <button id="verifyImageClickgic-${this.instanceId}" class="verify-btngic-${this.instanceId}" disabled>Verify</button>
                            <button class="refresh-buttongic-${this.instanceId}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Store reference to this instance for event handlers
        this.container.captchaInstance = this;
        
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    setupEventListeners() {
        const instanceId = this.instanceId;
        
        // Get elements for this instance
        const triggergic = document.getElementById(`verifyTriggergic-${instanceId}`);
        const modalgic = document.getElementById(`verificationModalgic-${instanceId}`);
        const closeBtngic = document.getElementById(`modalClosegic-${instanceId}`);

        if (!triggergic || !modalgic) return;

        // Event listeners
        triggergic.addEventListener('click', () => {
            this.handleTriggerClick();
        });

        closeBtngic.addEventListener('click', () => {
            this.handleFailuregic();
        });

        modalgic.addEventListener('click', (e) => {
            if (e.target === modalgic) this.handleFailuregic();
        });

        // Setup CAPTCHA type specific events
        this.setupType1Events();
        this.setupType2Events();
        this.setupType3Events();
    }

    initializeCaptchaData() {
        // CAPTCHA configuration data
        this.imageData = [
            { src: "https://i.postimg.cc/tJ08Qq7n/download-1.jpg", alt: "Bird", type: "bird", correct: true },
            { src: "https://i.postimg.cc/7LFKbB4p/download-2.jpg", alt: "Plane", type: "plane", correct: false },
            { src: "https://i.postimg.cc/hvgM1ffs/download-3.jpg", alt: "Bottle", type: "bottle", correct: true },
            { src: "https://i.postimg.cc/kgkQyBHS/download-4.jpg", alt: "Clock", type: "clock", correct: true },
            { src: "https://i.postimg.cc/2yhyrSws/download-5.jpg", alt: "Palm fruit", type: "palm-fruit", correct: true },
            { src: "https://i.postimg.cc/90tFCdgn/download.jpg", alt: "Sea", type: "sea", correct: false },
            { src: "https://i.postimg.cc/9XZQ4zdS/images-1.jpg", alt: "Coconut tree", type: "coconut-tree", correct: false },
            { src: "https://i.postimg.cc/qvbJfKrt/download-6.jpg", alt: "Monkey", type: "monkey", correct: false },
            { src: "https://i.postimg.cc/dQ2Jspvc/download-7.jpg", alt: "Mars", type: "mars", correct: false },
            { src: "https://i.postimg.cc/sXXL2zdw/images-3.jpg", alt: "New Image", type: "new1", correct: false },
            { src: "https://i.postimg.cc/QNg6rVW2/broom.jpg", alt: "Broom", type: "broom", correct: false },
            { src: "https://i.postimg.cc/W3vM96Sd/mobile.jpg", alt: "Mobile", type: "mobile", correct: true },
            { src: "https://i.postimg.cc/8Pjrm0D9/blb.jpg", alt: "BLB", type: "blb", correct: true }
        ];

        this.imageSets = {
            1: {
                imageUrl: "https://i.postimg.cc/Z5NxCx71/Picsart-25-10-03-07-50-10-932.jpg",
                clickSequence: ['book', 'scissor', 'guitar', 'vase', 'chair'],
                areas: [
                    { target: 'book', coords: [402,194,513,307], shape: 'rect' },
                    { target: 'scissor', coords: [1,93,139,201], shape: 'rect' },
                    { target: 'guitar', coords: [99,546,235,647], shape: 'rect' },
                    { target: 'vase', coords: [485,429,631,560], shape: 'rect' },
                    { target: 'chair', coords: [486,637,56], shape: 'circle' }
                ]
            },
            2: {
                imageUrl: "https://i.postimg.cc/s2cwRrMn/Colorsinorder.jpg",
                clickSequence: ['house', 'plane', 'lock'],
                areas: [
                    { target: 'house', coords: [425,231,528,316], shape: 'rect' },
                    { target: 'plane', coords: [434,500,573,639], shape: 'rect' },
                    { target: 'lock', coords: [100,489,194,575], shape: 'rect' }
                ]
            }
        };

        this.shapeTypes = ['square', 'circle', 'triangle', 'diamond'];
        
        // State variables
        this.selectedImages = [];
        this.currentCaptchaType = 1;
        this.isDragging = false;
        this.sliderPosition = 0;
        this.currentCorrectAnswers = [];
        this.currentShapeType = 'square';
        this.targetPosition = 0;
        this.shapeStartPosition = 0;
        this.isFirstTry = true;
        this.hasDragged = false;
        this.clickedItems = [];
        this.clickCounter = 0;
        this.clickPositions = [];
        this.currentImageSet = 1;
    }

    setupType1Events() {
        const instanceId = this.instanceId;
        const completeVerificationBtn = document.getElementById(`completeVerificationgic-${instanceId}`);
        const captchaGrid = document.getElementById(`captchaGridgic-${instanceId}`);
        const refreshBtn = document.querySelector(`#captchaType1gic-${instanceId} .refresh-buttongic-${instanceId}`);

        if (completeVerificationBtn) {
            completeVerificationBtn.addEventListener('click', () => {
                this.completeType1Verification();
            });
        }

        if (captchaGrid) {
            captchaGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains(`captcha-imagegic-${instanceId}`)) {
                    const container = e.target.parentElement;
                    const type = container.getAttribute('data-type');
                    this.handleImageSelection(container, type);
                }
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCaptcha(1);
            });
        }
    }

    setupType2Events() {
        const instanceId = this.instanceId;
        const verifySlidePuzzleBtn = document.getElementById(`verifySlidePuzzlegic-${instanceId}`);
        const puzzleSlider = document.getElementById(`puzzleSlidergic-${instanceId}`);
        const refreshBtn = document.querySelector(`#captchaType2gic-${instanceId} .refresh-buttongic-${instanceId}`);

        if (verifySlidePuzzleBtn) {
            verifySlidePuzzleBtn.addEventListener('click', () => {
                this.completeType2Verification();
            });
        }

        if (puzzleSlider) {
            // Mouse events
            puzzleSlider.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.duringDrag(e));
            document.addEventListener('mouseup', () => this.stopDrag());

            // Touch events
            puzzleSlider.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
            document.addEventListener('touchmove', (e) => this.duringDrag(e), { passive: false });
            document.addEventListener('touchend', () => this.stopDrag());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCaptcha(2);
            });
        }
    }

    setupType3Events() {
        const instanceId = this.instanceId;
        const verifyImageClickBtn = document.getElementById(`verifyImageClickgic-${instanceId}`);
        const clickImage = document.querySelector(`#captchaType3gic-${instanceId} .click-imagegic-${instanceId}`);
        const refreshBtn = document.querySelector(`#captchaType3gic-${instanceId} .refresh-buttongic-${instanceId}`);

        if (verifyImageClickBtn) {
            verifyImageClickBtn.addEventListener('click', () => {
                this.completeType3Verification();
            });
        }

        if (clickImage) {
            clickImage.addEventListener('click', (e) => {
                this.handleImageClick(e);
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCaptcha(3);
            });
        }
    }

    // ========== CORE CAPTCHA FUNCTIONALITY ==========

    handleTriggerClick() {
        if (this.isVerified) return;

        const instanceId = this.instanceId;
        const triggergic = document.getElementById(`verifyTriggergic-${instanceId}`);
        const containergic = document.getElementById(`captchaContainergic-${instanceId}`);
        const textElementgic = document.getElementById(`statusTextgic-${instanceId}`);
        const modalgic = document.getElementById(`verificationModalgic-${instanceId}`);

        triggergic.style.display = 'none';
        containergic.classList.add(`loading-stategic-${instanceId}`);
        containergic.classList.remove(`failed-stategic-${instanceId}`);
        textElementgic.classList.add(`loading-textgic-${instanceId}`);
        textElementgic.innerText = 'Processing...';

        const loadingBarContainergic = document.querySelector(`.loading-bar-containergic-${instanceId}`);
        const loadingBargic = document.getElementById(`loadingBargic-${instanceId}`);
        loadingBarContainergic.classList.add(`activegic-${instanceId}`);

        setTimeout(() => {
            this.currentCaptchaType = this.getRandomCaptchaType();
            this.showCaptchaType(this.currentCaptchaType);
            modalgic.style.display = 'flex';
        }, 700);
    }

    getRandomCaptchaType() {
        const random = Math.random();
        if (random < 1/3) return 1;
        if (random < 2/3) return 2;
        return 3;
    }

    showCaptchaType(type) {
        const instanceId = this.instanceId;
        const captchaType1 = document.getElementById(`captchaType1gic-${instanceId}`);
        const captchaType2 = document.getElementById(`captchaType2gic-${instanceId}`);
        const captchaType3 = document.getElementById(`captchaType3gic-${instanceId}`);

        captchaType1.style.display = 'none';
        captchaType2.style.display = 'none';
        captchaType3.style.display = 'none';

        if (type === 1) {
            captchaType1.style.display = 'block';
            this.initializeType1();
        } else if (type === 2) {
            captchaType2.style.display = 'block';
            this.initializeType2();
        } else if (type === 3) {
            captchaType3.style.display = 'block';
            this.initializeType3();
        }
    }

    // Type 1: Image Selection
    initializeType1() {
        this.selectedImages = [];
        this.createCaptchaGrid();
    }

    createCaptchaGrid() {
        const instanceId = this.instanceId;
        const grid = document.getElementById(`captchaGridgic-${instanceId}`);
        if (!grid) return;

        const correctImages = this.imageData.filter(img => img.correct);
        const incorrectImages = this.imageData.filter(img => !img.correct);

        const correctCount = Math.floor(Math.random() * 2) + 3;
        const selectedCorrect = this.shuffleArray(correctImages).slice(0, correctCount);
        const remainingCount = 9 - correctCount;
        const selectedIncorrect = this.shuffleArray(incorrectImages).slice(0, remainingCount);

        const finalSelection = this.shuffleArray([...selectedCorrect, ...selectedIncorrect]);

        grid.innerHTML = '';

        finalSelection.forEach((image) => {
            const container = document.createElement('div');
            container.className = `image-containergic-${instanceId}`;
            container.setAttribute('data-type', image.type);
            container.setAttribute('data-correct', image.correct);

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = `captcha-imagegic-${instanceId}`;

            container.appendChild(img);
            grid.appendChild(container);
        });

        this.updateCorrectAnswers(selectedCorrect.map(img => img.type));
    }

    handleImageSelection(container, type) {
        const instanceId = this.instanceId;
        
        if (this.selectedImages.includes(type)) {
            // Deselect
            const index = this.selectedImages.indexOf(type);
            this.selectedImages.splice(index, 1);
            container.classList.remove(`selectedgic-${instanceId}`);
        } else {
            // Select
            this.selectedImages.push(type);
            container.classList.add(`selectedgic-${instanceId}`);
        }
    }

    updateCorrectAnswers(correctTypes) {
        this.currentCorrectAnswers = correctTypes;
    }

    completeType1Verification() {
        const allCorrectSelected = this.currentCorrectAnswers.every(item => this.selectedImages.includes(item));
        const noIncorrectSelected = this.selectedImages.every(item => this.currentCorrectAnswers.includes(item));

        if (allCorrectSelected && noIncorrectSelected) {
            this.completeVerification();
        } else {
            this.handleFailuregic();
        }
    }

    // Type 2: Slide Puzzle
    initializeType2() {
        this.isDragging = false;
        this.sliderPosition = 5;
        this.isFirstTry = true;
        this.hasDragged = false;

        const instanceId = this.instanceId;
        const puzzleSlider = document.getElementById(`puzzleSlidergic-${instanceId}`);
        if (puzzleSlider) {
            puzzleSlider.style.left = '5px';
            puzzleSlider.style.transform = 'scale(1)';
        }

        this.currentShapeType = this.shapeTypes[Math.floor(Math.random() * this.shapeTypes.length)];

        const trackWidth = 250;
        const shapeWidth = 40;
        const minTargetPos = 10 + 20;
        const maxTargetPos = trackWidth - shapeWidth - 10 - 20;

        this.targetPosition = Math.floor(Math.random() * (maxTargetPos - minTargetPos)) + minTargetPos;

        const randomShape = document.getElementById(`randomShapegic-${instanceId}`);
        const puzzleTarget = document.getElementById(`puzzleTargetgic-${instanceId}`);

        if (randomShape) {
            randomShape.className = `random-shapegic-${instanceId} ${this.currentShapeType}gic-${instanceId}`;
            randomShape.style.left = '10px';
        }

        if (puzzleTarget) {
            puzzleTarget.className = `puzzle-targetgic-${instanceId} ${this.currentShapeType}gic-${instanceId}`;
            puzzleTarget.style.left = this.targetPosition + 'px';
        }

        if (puzzleSlider) {
            puzzleSlider.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }

        if (this.currentShapeType === 'triangle') {
            if (randomShape) randomShape.style.borderBottomColor = '#48dbfb';
        } else {
            if (randomShape) randomShape.style.background = this.getShapeColor(this.currentShapeType);
        }
    }

    getShapeColor(shapeType) {
        switch(shapeType) {
            case 'square':
                return 'linear-gradient(135deg, #FFD700, #FFA500)';
            case 'circle':
                return 'linear-gradient(135deg, #FF6B6B, #EE5A24)';
            case 'triangle':
                return '#48dbfb';
            case 'diamond':
                return 'linear-gradient(135deg, #1dd1a1, #10ac84)';
            default:
                return 'linear-gradient(135deg, #FFD700, #FFA500)';
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.hasDragged = true;
        const instanceId = this.instanceId;
        const puzzleSlider = document.getElementById(`puzzleSlidergic-${instanceId}`);
        
        if (puzzleSlider) {
            puzzleSlider.style.cursor = 'grabbing';
            puzzleSlider.classList.add(`activegic-${instanceId}`);
        }

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    duringDrag(e) {
        if (!this.isDragging) return;

        const instanceId = this.instanceId;
        const sliderContainer = document.querySelector(`.puzzle-slider-containergic-${instanceId}`);
        const puzzleSlider = document.getElementById(`puzzleSlidergic-${instanceId}`);
        const randomShape = document.getElementById(`randomShapegic-${instanceId}`);

        if (!sliderContainer || !puzzleSlider || !randomShape) return;

        const sliderRect = sliderContainer.getBoundingClientRect();
        let clientX;

        if (e.type === 'mousemove') {
            clientX = e.clientX;
        } else if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
        }

        if (clientX) {
            const leftGap = 5;
            const rightGap = 5;
            const availableWidth = sliderRect.width - (leftGap + rightGap) - 50;

            let newPosition = clientX - sliderRect.left - 25;

            const minSliderPosition = leftGap;
            const maxSliderPosition = leftGap + availableWidth;
            newPosition = Math.max(minSliderPosition, Math.min(maxSliderPosition, newPosition));

            this.sliderPosition = newPosition;
            puzzleSlider.style.left = newPosition + 'px';

            const trackWidth = 250;
            const minShapePosition = 10;
            const maxShapePosition = trackWidth - 40 - 10;

            const shapeNewPosition = minShapePosition + ((newPosition - leftGap) / availableWidth) * (maxShapePosition - minShapePosition);
            randomShape.style.left = shapeNewPosition + 'px';
        }

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const instanceId = this.instanceId;
        const puzzleSlider = document.getElementById(`puzzleSlidergic-${instanceId}`);
        const randomShape = document.getElementById(`randomShapegic-${instanceId}`);

        if (puzzleSlider) {
            puzzleSlider.style.cursor = 'grab';
            puzzleSlider.style.transform = 'scale(1)';
            puzzleSlider.classList.remove(`activegic-${instanceId}`);
        }

        if (randomShape) {
            const shapeLeft = parseInt(randomShape.style.left);
            const distance = Math.abs(shapeLeft - this.targetPosition);
            
            if (distance < 4) {
                if (puzzleSlider) {
                    puzzleSlider.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                }

                if (this.currentShapeType === 'triangle') {
                    randomShape.style.borderBottomColor = '#4CAF50';
                } else {
                    randomShape.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                }

                setTimeout(() => {
                    this.completeVerification();
                }, 500);
            } else {
                if (this.isFirstTry && this.hasDragged) {
                    this.isFirstTry = false;
                    setTimeout(() => {
                        this.handleFailuregic();
                    }, 300);
                }
            }
        }
    }

    completeType2Verification() {
        if (!this.hasDragged) {
            this.handleFailuregic();
        } else {
            this.handleFailuregic();
        }
    }

    // Type 3: Image Click
    initializeType3() {
        this.currentImageSet = Math.random() > 0.5 ? 1 : 2;
        const imageSet = this.imageSets[this.currentImageSet];

        this.clickedItems = [];
        this.clickCounter = 0;
        this.clickPositions = [];

        const instanceId = this.instanceId;
        const verifyImageClickBtn = document.getElementById(`verifyImageClickgic-${instanceId}`);
        const clickImage = document.querySelector(`#captchaType3gic-${instanceId} .click-imagegic-${instanceId}`);
        const imageWrapper = document.querySelector(`#captchaType3gic-${instanceId} .click-image-wrappergic-${instanceId}`);

        // Clear existing markers
        if (imageWrapper) {
            const existingMarkers = imageWrapper.querySelectorAll(`.number-markergic-${instanceId}`);
            existingMarkers.forEach(marker => marker.remove());
        }

        if (verifyImageClickBtn) {
            verifyImageClickBtn.disabled = true;
            verifyImageClickBtn.textContent = 'Verify';
        }

        if (clickImage && imageSet) {
            clickImage.src = imageSet.imageUrl;
        }
    }

    handleImageClick(e) {
        const maxClicks = this.imageSets[this.currentImageSet].clickSequence.length;
        if (this.clickCounter >= maxClicks) {
            return;
        }

        const img = e.target;
        const rect = img.getBoundingClientRect();

        const displayedWidth = rect.width;
        const displayedHeight = rect.height;

        const originalWidth = 720;
        const originalHeight = 720;

        const scaleX = originalWidth / displayedWidth;
        const scaleY = originalHeight / displayedHeight;

        const displayedX = e.clientX - rect.left;
        const displayedY = e.clientY - rect.top;

        const originalX = displayedX * scaleX;
        const originalY = displayedY * scaleY;

        const target = this.getClickedTarget(originalX, originalY);

        this.clickCounter++;
        this.addNumberMarker(displayedX, displayedY, this.clickCounter);

        this.clickPositions.push({x: originalX, y: originalY, number: this.clickCounter, target});

        if (target && this.imageSets[this.currentImageSet].clickSequence.includes(target)) {
            this.clickedItems.push(target);
        }

        const requiredClicks = this.imageSets[this.currentImageSet].clickSequence.length;
        if (this.clickCounter === requiredClicks) {
            const instanceId = this.instanceId;
            const verifyImageClickBtn = document.getElementById(`verifyImageClickgic-${instanceId}`);
            if (verifyImageClickBtn) {
                verifyImageClickBtn.disabled = false;
            }
        }
    }

    getClickedTarget(x, y) {
        const areas = this.imageSets[this.currentImageSet].areas;

        for (let area of areas) {
            if (area.shape === 'rect') {
                const [x1, y1, x2, y2] = area.coords;
                if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                    return area.target;
                }
            } else if (area.shape === 'circle') {
                const [cx, cy, r] = area.coords;
                const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                if (distance <= r) {
                    return area.target;
                }
            }
        }

        return null;
    }

    addNumberMarker(x, y, number) {
        const instanceId = this.instanceId;
        const marker = document.createElement('div');
        marker.className = `number-markergic-${instanceId}`;
        marker.textContent = number;
        marker.style.left = x + 'px';
        marker.style.top = y + 'px';

        const imageWrapper = document.querySelector(`#captchaType3gic-${instanceId} .click-image-wrappergic-${instanceId}`);
        if (imageWrapper) {
            imageWrapper.appendChild(marker);
        }
    }

    completeType3Verification() {
        const imageSet = this.imageSets[this.currentImageSet];
        const requiredSequence = imageSet.clickSequence.join(',');
        const userSequence = this.clickedItems.join(',');

        if (userSequence === requiredSequence) {
            this.completeVerification();
        } else {
            this.handleFailuregic();
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    completeVerification() {
        const instanceId = this.instanceId;
        const modalgic = document.getElementById(`verificationModalgic-${instanceId}`);
        const containergic = document.getElementById(`captchaContainergic-${instanceId}`);
        const textElementgic = document.getElementById(`statusTextgic-${instanceId}`);
        const triggergic = document.getElementById(`verifyTriggergic-${instanceId}`);

        modalgic.style.display = 'none';
        containergic.classList.remove(`loading-stategic-${instanceId}`);
        textElementgic.classList.add(`success-textgic-${instanceId}`);
        textElementgic.textContent = 'Verification Successful.';
        containergic.classList.add(`success-stategic-${instanceId}`);

        const loadingBarContainergic = document.querySelector(`.loading-bar-containergic-${instanceId}`);
        const loadingBargic = document.getElementById(`loadingBargic-${instanceId}`);
        loadingBarContainergic.classList.remove(`activegic-${instanceId}`);

        const successIndicatorgic = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        successIndicatorgic.setAttribute("class", `tick-animgic-${instanceId}`);
        successIndicatorgic.setAttribute("viewBox", "0 0 24 24");
        successIndicatorgic.innerHTML = '<polyline points="20 6 9 17 4 12"/>';

        if (triggergic) {
            triggergic.replaceWith(successIndicatorgic);
        }
        
        this.isVerified = true;

        // Notify verification system
        if (window.captchaVerification) {
            window.captchaVerification.markAsVerified(this.instanceId);
        }

        if (this.options.onSuccess) {
            this.options.onSuccess();
        }
    }

    handleFailuregic() {
        if (this.isVerified) return;
        
        const instanceId = this.instanceId;
        const modalgic = document.getElementById(`verificationModalgic-${instanceId}`);
        const containergic = document.getElementById(`captchaContainergic-${instanceId}`);
        const textElementgic = document.getElementById(`statusTextgic-${instanceId}`);
        const triggergic = document.getElementById(`verifyTriggergic-${instanceId}`);

        modalgic.style.display = 'none';
        containergic.classList.remove(`loading-stategic-${instanceId}`);
        containergic.classList.add(`failed-stategic-${instanceId}`);
        textElementgic.innerText = 'Verification failed, try again.';
        textElementgic.classList.add(`failed-textgic-${instanceId}`);
        textElementgic.classList.remove(`loading-textgic-${instanceId}`);
        
        if (triggergic) {
            triggergic.style.display = 'block';
            triggergic.classList.add(`j1k2l3mgic-${instanceId}`);
        }

        const loadingBarContainergic = document.querySelector(`.loading-bar-containergic-${instanceId}`);
        loadingBarContainergic.classList.remove(`activegic-${instanceId}`);

        if (this.options.onError) {
            this.options.onError();
        }
    }

    refreshCaptcha(type) {
        const refreshBtn = event.target.closest(`.refresh-buttongic-${this.instanceId}`);
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 300);
        }

        switch(type) {
            case 1:
                this.initializeType1();
                break;
            case 2:
                this.initializeType2();
                break;
            case 3:
                this.initializeType3();
                break;
        }
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    getVerificationStatus() {
        return this.isVerified;
    }

    reset() {
        this.isVerified = false;
        this.selectedImages = [];
        this.clickedItems = [];
        this.clickCounter = 0;
        this.clickPositions = [];

        const instanceId = this.instanceId;
        const containergic = document.getElementById(`captchaContainergic-${instanceId}`);
        const textElementgic = document.getElementById(`statusTextgic-${instanceId}`);
        const triggergic = document.getElementById(`verifyTriggergic-${instanceId}`);
        const modalgic = document.getElementById(`verificationModalgic-${instanceId}`);

        // Reset visual state
        containergic.classList.remove(`success-stategic-${instanceId}`, `failed-stategic-${instanceId}`, `loading-stategic-${instanceId}`);
        textElementgic.classList.remove(`success-textgic-${instanceId}`, `failed-textgic-${instanceId}`, `loading-textgic-${instanceId}`);
        textElementgic.textContent = 'I\'m not a robot';
        
        if (triggergic) {
            triggergic.style.display = 'block';
            triggergic.classList.remove(`j1k2l3mgic-${instanceId}`);
        }
        
        modalgic.style.display = 'none';

        // Reset verification system
        if (window.captchaVerification) {
            window.captchaVerification.resetVerification(this.instanceId);
        }
    }
}

// Global initialization function
window.initCaptcha = function(containerId, options) {
    return new CustomCaptcha(containerId, options);
};

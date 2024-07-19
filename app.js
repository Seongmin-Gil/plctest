const ModbusRTU = require("modbus-serial")
const async = require("async");

const client = new ModbusRTU();
const timeoutConnectRef = null 

const connect = () => {
    console.log("Connecting..!!");
    clearTimeout(timeoutConnectRef);

    if(client.isOpen){
        console.log('Already connected!!');
        run();
    }

    client.connectRTUBuffered("/dev/ttyUSB0", {dataBits: 8, stopBits: 1, baudRate: 115200})
    .then(setClient)
    .then(function() {console.log("Connected");})
}

const setClient = () => {
    console.log("Set client ID..!!");
    client.setID(1);
    client.setTimeout(3000);

    mobdusTester();
}

function write() {
    // write the values 0, 0xffff to registers starting at address 5
    // on device number 1.
    client.writeRegisters(5, [0 , 0xffff]) //PLC I/O List 추후 설정
        .then(read);
}

function read() {
    // read the 2 registers starting at address 5
    // on device number 1.
    client.readHoldingRegisters(5, 2)  //PLC I/O List 추후 설정
        .then(console.log("1"));
}

const mobdusTester = () => {

    let loopCnt = 100; // 루프 수행 횟수
    const _startTime = new Date().getTime(); // 시작시간

    for (let i = 0; i < loopCnt; i++) {
        write();
    }
    const _endTime = new Date().getTime(); // 종료시간 
    console.log(`Result Time :  ${_endTime - _startTime} ms`);
}

connect()
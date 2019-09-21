const fetch = require('node-fetch');

// function testFunc() {   
//     fetch(`http://localhost:3000/restapi/categories`).then((res) => {
//         res.text().then((text) => {            
//             console.log(text);
//         });
//     });    
// }

var testFunc2 = () => {   
    return new Promise(function(resolve, reject){
        fetch('http://localhost:3000/restapi/categories')
        .then(res=>res.text())
        .then(text=>{
            console.log(text);
            resolve("async는 Promise방식을 사용합니다.");
        });
    });
}

var excuteFunc = async ()=>{
    await testFunc2();
    console.log('Step2');
}

excuteFunc();

// var testFunc4 = (sec) => {
//     return new Promise(function(resolve, reject){
//         setTimeout( function(){
//             console.log('testFunc4');
//             resolve("async는 Promise방식을 사용합니다.");
//         }, sec);
//     });
// }

// var testFunc3 = async () => {   
    
//     await testFunc4(1000);
    
//     var res = await fetch('http://localhost:3000/restapi/categories');
//     var text = await res.text();
//     console.log(text);

    
// }


// var materials = [
//     'Hydrogen',
//     'Helium',
//     'Lithium',
//     'Beryllium'
// ];

// console.log(materials.map(material => material.length));
// // expected output: Array [8, 6, 7, 9]

// console.log(materials.map((material) => {
//     return material.length;
// }));

// console.log(materials.map(function (material) {
//     return material.length;
// }));


// async function test(){
//     await foo(1, 2000)
//     await foo(2, 500)
//     await foo(3, 1000)
// }

// function foo(num, sec){
//     setTimeout( function(){
//         console.log(num);
//     }, sec);
// }

// function foo(num, sec){
//     return new Promise(function(resolve, reject){
//         setTimeout( function(){
//             console.log(num);
//             resolve("async는 Promise방식을 사용합니다.");
//         }, sec);
//     });
// }

// test();


function createClientTarget(userIdInt: number, clientTarget: Map<number, string>){
    for(var i=1; i<=100; i++){
        if(i !== userIdInt ){
            clientTarget.set(i, "machine-" + i);
        }
    }
}

function selectsTarget(myNum: number, numTarget: number){
    var targets = []
    var x = Math.floor(100/numTarget);
    var z = myNum;
    for(var i=0; i<numTarget; i++){
        z = z + myNum;
        if(z >= 100){
            z = z-100;
        }
        targets.push(z);
    }

    return targets;
}

const prova = new Map();
createClientTarget(24, prova);
console.log(prova);
console.log(prova.get(22));
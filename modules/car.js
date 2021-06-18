const car = {
    brand:"Ford",
    color:"blue",
}

exports.getColor = function(){
    return car.color;
}
exports.setColor = function(color){
    
        car.color = color
    
    
}

// module.exports = {};
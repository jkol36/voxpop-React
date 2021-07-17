
//User prototype for testing of this code
var users = [];

function User(userName, coinTotal){
	this.userName = userName;
	this.coinTotal = coinTotal;
}

//Initialize Users
for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0))
}


//easier to write than to figure out how to import Math library
function power(x,y){
	if(y<0){
		return 1/(power(x,(-1 * y)));
	}

	var product = 1;
	for(var i = 0; i < y; i++){
		product *= x;
	}
	return product
}

//easier to write than figure out how to import Math library
function roundToInt(x){
	var fraction = x - parseInt(x);
	var firstDecimalPlace = parseInt(fraction * 10);
	if(firstDecimalPlace >= 5){
		return parseInt(x) + 1;
	}else{
		return parseInt(x);
	}
}



//Constructor for desired equation. This way we can change the equation
//we want to use by constructing a new EarningsEquation Object if the first one doesn't 
//work well
function EarningsEquation(coefficient, order){
	this.coefficient = coefficient;
	this.order = order;
	this.y = function(x){
		return coefficient * power(x,order);
	};
	this.integralEquation = function(){
		return (new EarningsEquation(this.coefficient / (order + 1), order + 1));
	}

}


//Object used to pay users. Equation used to calculate payment can be set 
//using the EarningEquation constructor above. 

//IMPORTANT: As of now, the priority is to get everyone at least the minimum payment amount of coins,
// and then any excess coins are given to the winner. If minimumPay is set to > 0, the only way people
// will not be paid is if totalCoins runs out. 

var winningsATM = {
	earningsEquation: new EarningsEquation(1,3),
	payUsers: function(winnersArray, totalCoins, minPay = 0){
		var partitionsSize = 1 / winnersArray.length;
		var sum = 0;
		for(var i = 0; i < winnersArray.length; i++){
			var areaUnderCurve = this.earningsEquation.integralEquation().y(1.0 - (partitionsSize * i)) - this.earningsEquation.integralEquation().y(1.0 - (partitionsSize * (i + 1)));
			var totalArea = this.earningsEquation.integralEquation().y(1.0) - this.earningsEquation.integralEquation().y(0.0);
			var payout = (areaUnderCurve / totalArea) * totalCoins;
			var intPayout = roundToInt(payout);
			if((intPayout < minPay) && (sum + minPay < totalCoins)){
				intPayout = minPay;
			}else if(sum + intPayout > totalCoins){
				intPayout = totalCoins - sum;
			}
			sum += intPayout;
			this.conductPayout(winnersArray[i], intPayout);
		}
		//give excess coins to the winner
		if(sum < totalCoins){
			this.conductPayout(winnersArray[0], totalCoins - sum); 
		}
	},
	conductPayout: function(user, amount){
		user.coinTotal = user.coinTotal + amount;
	}
}

//*************************************************************************************
//*************************************************************************************
//**************************** Code Demonstration *************************************
//*************************************************************************************
//*************************************************************************************
// Using the above functions and objects to perform a sucessful payout
// Default pay equation -> y = 1*(x^3)

winningsATM.payUsers(users, 1000);


//Test the payment
console.log("Command: winningsATM.payUsers(users, 1000)");
for(var i = 0; i < users.length; i++){
	console.log(`${users[i].userName} payment: ${users[i].coinTotal}`);
}
console.log("Test complete");

//reset users array
users = [];
for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}


//Pay again with custom set max and minimum values
winningsATM.payUsers(users, 10, 1);

//test the payment
console.log("Command: winningsATM.payUsers(users, 10, 1)");
for(var i = 0; i < users.length; i++){
	console.log(`${users[i].userName} payment: ${users[i].coinTotal}`);
}
console.log("Test complete");


//reset users array

users = [];

for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}

//Pay again with custom set max and minimum values
winningsATM.payUsers(users, 10, 0);

//test the payment
console.log("Command: winningsATM.payUsers(users, 10, 0)");
for(var i = 0; i < users.length; i++){
	console.log(`${users[i].userName} payment: ${users[i].coinTotal}`);
}
console.log("Test complete");

//reset users array

users = [];

for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}

//Pay again with custom set max and minimum values
winningsATM.payUsers(users, 10000, 0);

//test the payment
console.log("Command: winningsATM.payUsers(users, 10000, 0)");
for(var i = 0; i < users.length; i++){
	console.log(`${users[i].userName} payment: ${users[i].coinTotal}`);
}
console.log("Test complete");



//Change the equation from 1*(x^3) to 3*(x^2)




winningsATM.earningsEquation = new EarningsEquation(3,2);
console.log("Equation changed to y=3x^2")




//reset users array

users = [];

for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}

//pay users with new earnings equation

winningsATM.payUsers(users, 1000);

//test payment
console.log("Command: winningsATM.payUsers(users, 1000)");
for(var i = 0; i < users.length; i++){
	console.log(`${users[i].userName} payment: ${users[i].coinTotal}`);
}
console.log("Test complete");


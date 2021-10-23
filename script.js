"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// ----display the movements----
const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${mov}€</div>
  </div>
  
  `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

// ----calculate the total blance---
const calcDisplayBlance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = ` ${account.balance}€`;
};
// calcDisplayBlance(account1.movements);

// ----calculate the summary----

const calcDisplaySummury = function (account) {
  const transaction = account.movements;
  // income summary
  const income = transaction
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}€`;

  // outcome summary
  const outcome = transaction
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  // intrest summary
  const intrest = transaction
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * account.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, deposite) => {
      console.log(deposite);
      return acc + deposite;
    }, 0);

  labelSumInterest.textContent = `${Math.abs(intrest)}€`;
};

// calcDisplaySummury(account1.movements);

// -----computing user name----

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);

// -----------display ui function-----

const updateUI = function (account) {
  // display movments
  displayMovements(account.movements);

  // display blance
  calcDisplayBlance(account);

  // display summury

  calcDisplaySummury(account);
};

// ---------EVENT LISTNER------------
let currentAccount;

//----login activity-----------

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display Ui and wellcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // clear input fields

    inputLoginPin.value = inputLoginUsername.value = "";
    //  update ui
    updateUI(currentAccount);
  }
});
// ---------------------MONEY TRANSACTION ACTIVITY--------
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const reciverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  // console.log(reciverAccount, amount, currentAccount, reciverAccount.userName);

  // cleaning the field

  if (
    amount > 0 &&
    reciverAccount &&
    currentAccount.balance >= amount &&
    reciverAccount?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    // update ui
    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = "";
});

//------ close account activity--------------

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const pin = Number(inputClosePin.value);

  const deletedAcc = accounts.find(
    (acc) => acc.userName === inputCloseUsername.value
  );

  if (
    deletedAcc?.userName === currentAccount.userName &&
    currentAccount?.pin === pin
  ) {
    // find index
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    // delete using splice method

    accounts.splice(index, 1);
    // hide ui
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = "";
});

//------------ loan activity---------------
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  // const maxDeopsite = currentAccount.movements.reduce(
  //   (acc, mov) => (acc > mov ? acc : mov),
  //   currentAccount.movements[0]
  // );
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(loanAmount);
    // update the ui
    updateUI(currentAccount);
  }
  // cleare the input field
  inputLoanAmount.value = "";
});

// -------------sort activity------------

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted); //sorted=true
  sorted = !sorted; //sorted=false
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// array methods
/* 

let arr = ["a", "b", "c", "d", "e"];

// slice
console.log(arr.slice(0, -2)); //['a', 'b', 'c']
console.log(arr.slice());
console.log([...arr]);

// splice
console.log(arr.splice(2)); // ['c', 'd', 'e']
console.log(arr); //['a', 'b']

// reverse

arr = ["a", "b", "c", "d", "e"];
const arr2 = ["j", "i", "h", "g", "f"];
console.log(arr2.reverse()); //['j', 'g', 'h', 'i', 'j']
// reverse method actually mutuated the array
console.log(arr2); //) ['f', 'g', 'h', 'i', 'j']

// concat
const letter = arr.concat(arr2);
// same as
// const letter = [...arr, ...arr2];

// console.log(letter);
// ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

console.log([...arr, ...arr2]);

console.log(letter);

// join

console.log(letter.join("-"));
*/
//forEach loop and also acessing the index number
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} : you depositied ${movement}`);
  } else {
    console.log(`Movement ${i + 1} :you withdrew ${Math.abs(movement)}`);
  }
}
//  same loop using forEach higher order function and also acessing the index number
console.log("-------------------For Each------------------");
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} :you depositied ${movement}`);
  } else {
    console.log(`Movement ${i + 1} :you withdrew ${Math.abs(movement)}`);
  }
});
*/
// what just heppend in the above
//0:function(200);
//1:function(450);
//2:function(-400);
// ....

// with map and set
/*
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value} :`);
  //   console.log(map);
});
// output
// USD:United States dollar :
//  EUR:Euro :
//  GBP:Pound sterling :
// lets try with  sets
const currenciesUnique = new Set(["usd", "gbp", "usd", "eur", "eur"]);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}:${value} :`);
});

// output
// usd:usd :
//  gbp:gbp :
//  eur:eur :
// because set doesnot have any key value
*/

// //////////////////////////////////////////
//   map method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});
// this using for of loop
const movementsUsdFor = [];
for (const mov of movements) movementsUsdFor.push(mov * eurToUsd);
// output
// console.log(movements);
// console.log(movementsUsd);
// console.log(movementsUsdFor);
// same usnig arrow function
const movementsUsdArr = movements.map((mov) => mov * eurToUsd);

// console.log(movementsUsdArr);

const movementsDescription = movements.map(
  (movement, i) =>
    `Movement ${i + 1} :you ${
      movement > 0 ? "deposited" : "withdrew"
    } ${Math.abs(movement)}`
);
// console.log(movementsDescription);
*/
// ////////////////////////////////////////////
// filer method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const depoiste = movements.filter((mov) => mov > 0);
console.log(movements); //[200, 450, -400, 3000, -650, -130, 70, 1300]
console.log(depoiste); //[200, 450, 3000, 70, 1300]

// same thing with for of loop

const depositeFor = [];
for (const mov of movements) if (mov > 0) depositeFor.push(mov);
console.log(depositeFor);

const withdrawal = movements.filter((mov) => Math.abs(mov < 0));
console.log(withdrawal);

// THE REDUCE METHOD
console.log(movements);
//  shnow ball --> effect
// const balance = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`Itteration number: ${i} accumuleter is  :${acc}`);
//   return acc + mov;
// }, 0);
// using arrow function
const balance = movements.reduce((acc, mov) => acc + mov, 0);

console.log(balance);

//FIND  MAXIMUM NUMBER FORM THE MOVEMENTS ARRAY

const maxValue = movements.reduce(
  (acc, mov) => (acc < mov ? mov : acc), //if(acc>mov){return acc } else{ return mov}
  movements[0]
);

console.log(maxValue);
*/

// magicg with chaning

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
// pipeline

// const totalDepositeInUSD = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositeInUSD);

// find method

const fistWithdrawal = movements.find((mov) => mov < 0);

console.log(movements);
// console.log(fistWithdrawal);

let account = 0;
for (const acc of accounts) {
  if (acc.owner === "Jessica Davis") {
    account = acc;
  }
}
// console.log(account);
// /////////////////////////////////////////
// some() method return  a boolean value based on some condition

console.log(movements);
// Equality
console.log(movements.includes(-130));

// condition
const anyDeposite = movements.some((mov) => mov > 1500);
console.log(anyDeposite);
// max loan
const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);
console.log(max);

// Every () if all the element satifies the condtion then it will return true

console.log(movements.every((mov) => mov > 0)); //false

console.log(account4.movements);
console.log(account4.movements.every((mov) => mov > 0)); //true

// ///////////////////////////////////////
// flat and flatmap
const arr = [[1, 2, 3], [4, 5, 6], 7, 8, 9];
console.log(arr.flat()); //[1, 2, 3, 4, 5, 6, 7, 8, 9]
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8, 9];
console.log(arrDeep.flat(2)); //[1, 2, 3, 4, 5, 6, 7, 8, 9]
// with accounts array

// const accountsMovements = accounts.map((acc) => acc.movements);
// console.log(accountsMovements);

// const allMovements = accountsMovements.flat();
// console.log(allMovements);
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

const overAllBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overAllBalance);

// flat map()

const overAllBalance2 = accounts
  .flatMap((acc) => acc.movements)

  .reduce((acc, mov) => acc + mov, 0);

console.log(overAllBalance2);

// sort

// string
const owner = ["joans", "zach", "adam", "martha"];
console.log(owner.sort());
console.log(owner);
// with numbers

console.log(movements);

// return 1 (switch order) B A
// return -1 (keep order) A B

// Asscending
// movements.sort((a, b) => {
//   console.log(`A:${a},B: ${b}`);
//   if (a > b) return 1; // B A
//   if (a < b) return -1; //A B
// });

movements.sort((a, b) => a - b);
console.log(movements);
// Descending
// movements.sort((a, b) => {
//   console.log(`A:${a},B: ${b}`);
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

//filling array programtically
/*
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8, 9));
// empty array +fill method
const x = new Array(7);
console.log(x);

// x.fill(1);

x.fill(1, 3, 7);
console.log(x);
// FROM

const y = Array.from({ length: 7 }, () => 1);
console.log(y);
// create a array that hold 10 random dice roll
const diceRoll = Array.from({ length: 10 }, () =>
  Math.trunc(Math.random() * 7)
);
console.log(diceRoll);

labelBalance.addEventListener("click", function () {
  const moveUI = Array.from(document.querySelectorAll(".movements__value"));
  console.log(moveUI.map((el) => el.textContent.replace("€", "")));
});
*/

// /////////////////////////////////////////////////////////////////////////
//  practice method
// calculate how much has been deposited in the bank
//1
const bankDepositeSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositeSum);
//2
//how  many deposite is there is >1000 $
// const numDeposite1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov >= 1000).length;
// console.log(numDeposite1000);

const numDeposite1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

console.log(numDeposite1000);

// 3
//calculate toatal deposite and withdrel
const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposite += cur) : (sums.withdrals += cur);

      sums[cur > 0 ? "deposite" : "withdrals"] += cur;

      return sums;
    },
    { deposite: 0, withdrals: 0 }
  );
console.log(sums);

// 4
// this is a nice title->This Is a Nice Title

const convertTitleCase = function (title) {
  const execption = ["a", "an", "the", "but", "or", "on", "in", "with"];
  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      execption.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");

  return titleCase;
};
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("hi how are YOUs"));

console.log(convertTitleCase("and here is anotther title with an example"));

const test = `sourav, p, priya, rajdeep`;

console.log(
  test
    .toLowerCase()
    .split(" ")
    .map((char) => char[0].toUpperCase() + char.slice(1))
    .join(" ")
);

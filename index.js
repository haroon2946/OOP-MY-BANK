#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from '@faker-js/faker';
console.log(chalk.bold.magenta.italic("Welcome to Code-With-Haroon-Afridi - OOP-My-Bank"));
//Customer Class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gen, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gen;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
;
//Class Bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...newAccounts, accobj];
    }
}
;
let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.string.numeric(11));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
//Bank Functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "Select",
            message: "Kindly Select Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        // View Balance
        if (service.Select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Kindly Enter Your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Your Account Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }
        // Cash Withdraw
        if (service.Select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Kindly Enter Your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Kindly Enter your Amount",
                    name: "rupee"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("InSuffient Balance"));
                }
                let newBalance = account.balance - ans.rupee;
                // transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        // Cash Deposit
        if (service.Select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Kindly Enter Your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Kindly Enter your Amount",
                    name: "rupee"
                });
                let newBalance = account.balance + ans.rupee;
                // transaction method
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.Select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);

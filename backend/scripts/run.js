const main = async () => {
  const CoffeeContractFactory = await hre.ethers.getContractFactory(
    "CoffeePortal"
  );
  const coffeeContract = await CoffeeContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await coffeeContract.deployed();

  console.log("Contract deployed to:", coffeeContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    coffeeContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let coffeeTot;
  coffeeTot = await coffeeContract.getTotalCoffee();
  console.log(coffeeTot.toNumber());

  let coffeeTxn = await coffeeContract.coffee("Grab Coffee !");
  await coffeeTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(
    coffeeContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allCoffees = await coffeeContract.getAllCoffees();
  console.log(allCoffees);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

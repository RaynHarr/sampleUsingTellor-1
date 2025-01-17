const { expect } = require("chai");
const { ethers } = require("hardhat");
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")
const h = require("usingtellor/test/helpers/helpers.js");

describe("Tellor", function() {
  let sampleUsingTellor;
  let tellorOracle;

  // Set up Tellor Playground Oracle and SampleUsingTellor
  beforeEach(async function () {
    let TellorOracle = await ethers.getContractFactory(abi, bytecode);
    tellorOracle = await TellorOracle.deploy();
    await tellorOracle.deployed();

    let SampleUsingTellor = await ethers.getContractFactory("SampleUsingTellor");
    sampleUsingTellor = await SampleUsingTellor.deploy(tellorOracle.address);
    await sampleUsingTellor.deployed();
  });

  it("Update Price", async function() {
    const queryId = h.uintTob32(1);
    const mockValue = 150;
    // submit value takes 4 args : queryId, value, nonce and queryData
    // Tim uses h.uintTob32(1),150,0,'0x' for these in usingtellor test, so i will use the same
    await tellorOracle.submitValue(queryId,150,0,'0x');
    let retrievedVal = await sampleUsingTellor.readTellorValue(queryId);
    expect(retrievedVal).to.equal(h.bytes(mockValue));
  });
});

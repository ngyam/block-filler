const FF = artifacts.require("FastFiller");
const SF = artifacts.require("SlowFiller");

module.exports = async function(deployer) {
  await deployer.deploy(FF);
  await deployer.deploy(SF);
};

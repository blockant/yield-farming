/ SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract YieldFarming {
    address public token;
    uint256 public rewardPerBlock;
    uint256 public totalRewards;
    uint256 public lastUpdateBlock;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lpBalances;
    mapping(address => bool) public isLPToken;
    mapping(address => uint256) public lpRewardProportions;
    address[] public lpTokenList;
    address public owner;
    address public factoryContract;
    
    constructor(address _token, uint256 _rewardPerBlock, address _factoryContract) {
        token = _token;
        rewardPerBlock = _rewardPerBlock;
        owner = msg.sender;
        factoryContract = _factoryContract;
    }
    
    function depositLP(address _lpToken, uint256 _amount) public {
        require(isLPToken[_lpToken], "Invalid LP token");
        require(_amount > 0, "Amount must be greater than 0");
        updateRewards();
        IERC20(_lpToken).transferFrom(msg.sender, address(this), _amount);
        lpBalances[msg.sender] += _amount;
    }
    
    function withdrawLP(address _lpToken, uint256 _amount) public {
        require(isLPToken[_lpToken], "Invalid LP token");
        require(_amount > 0, "Amount must be greater than 0");
        updateRewards();
        require(_amount <= lpBalances[msg.sender], "Insufficient LP balance");
        IERC20(_lpToken).transfer(msg.sender, _amount);
        lpBalances[msg.sender] -= _amount;
    }
    
    function getLPBalance(address _lpToken) public view returns (uint256) {
        return lpBalances[msg.sender];
    }
    
    function getReward() public {
        updateRewards();
        uint256 reward = balances[msg.sender] * (totalRewards - lastUpdateBlock * rewardPerBlock) / 1e18;
        require(reward > 0, "No rewards available");
        IERC20(token).transfer(msg.sender, reward);
    }
    
    function addLPToken(address _lpToken, uint256 _lpRewardProportion) public {
        require(msg.sender == owner, "Only the contract owner can add LPTokens");
        require(!isLPToken[_lpToken], "LPToken already added");
        isLPToken[_lpToken] = true;
        lpTokenList.push(_lpToken);
        lpRewardProportions[_lpToken] = _lpRewardProportion;
    }
    
    function updateRewards() internal {
        uint256 currentBlock = block.number;
        uint256 blocksPassed = currentBlock - lastUpdateBlock;
        if (blocksPassed > 0) {
            uint256 rewards = blocksPassed * rewardPerBlock;
            totalRewards += rewards;
            lastUpdateBlock = currentBlock;
            for (uint i = 0; i < lpTokenList.length; i++) {
                address lpToken = lpTokenList[i];
                uint256 lpReward = rewards * lpRewardProportions[lpToken] / 100;
                balances[lpToken] += lpBalances[lpToken] * lpReward / 1e18;
            }
        }
    }   
}
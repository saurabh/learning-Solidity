pragma solidity ^0.6.8;

// "SPDX-License-Identifier: UNLICENSED"
contract CampaignFactory {
    address[] public deployedCampaigns;
 
    function createCampaign(uint minContribution) public {
        Campaign newCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }
 
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    Request[] public requests;
    uint public approversCount = 0;
    mapping(address => bool) public approvers;
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can invoke this.");
        _;
    }
    
    constructor(uint _minimumContribution, address _manager) public {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution, "Contribution is below the required amount");
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory _description, uint _value, address payable _recipient) public onlyManager {
        require(_value <= address(this).balance, "Not enough funds to request that amount");
        
        Request memory newRequest = Request({
           description: _description,
           value: _value,
           recipient: _recipient,
           complete: false,
           approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender], "You have not contributed to this crowdfund.");
        require(!request.approvals[msg.sender], "You have already voted on this request.");
        require(request.complete == false, "Request was already finalized.");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public onlyManager {
        Request storage request = requests[index];
        
        require(!request.complete, "This request is marked completed.");
        require(request.approvalCount > (approversCount / 2), "Not enough approvals.");
 
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
pragma solidity ^0.6.6;


contract ItemManager {
    enum SupplyChainState{Created, Paid, Delivered}
    
    struct S_Item {
        string _identifier;
        uint _itemPrice;
        ItemManager.SupplyChainState _state;
    }
    
    mapping(uint => S_Item) items;
    uint itemIndex;
     
    event SupplyChainStep(uint _itemIndex, uint _step);
    
    function createItem(string memory _identifier, uint _itemPrice) public {
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state));
        itemIndex++;
    }
    
    function triggerPaymenr(uint _itemIndex) public payable {
        require(items[_itemIndex]._itemPrice == msg.value, "Payment must be made in full");
        require(items[_itemIndex]._state == SupplyChainState.Created, "This item has already been paid for");
        items[itemIndex]._state = SupplyChainState.Paid;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state));
    }
    
    function triggerDelivery(uint _itemIndex) public {
        require(items[_itemIndex]._state == SupplyChainState.Paid, "This item is further in the chain");
        items[itemIndex]._state = SupplyChainState.Delivered;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state));
    }
}

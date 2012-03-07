(function() {
if (!ko.bindingFlags) { ko.bindingFlags = {}; }

function makeArrayItemAccessor(repeatArray, index, notificationObservable) {
    return function() {
        notificationObservable();   // for dependency tracking
        return ko.utils.unwrapObservable(repeatArray[index]);
    };
}

ko.bindingHandlers['repeat'] = {
    'flags': ko.bindingFlags.contentBind,
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // initialize optional parameters
        var repeatIndex = '$index', repeatData = '$item', repeatBind;
        var repeatParam = ko.utils.unwrapObservable(valueAccessor());
        if (typeof repeatParam == 'object') {
            if ('index' in repeatParam) repeatIndex = repeatParam['index'];
            if ('item' in repeatParam) repeatData = repeatParam['item'];
            if ('bind' in repeatParam) repeatBind = repeatParam['bind'];
        }

        // First clean the element node and remove node's binding
        ko.cleanNode(element);
        element.removeAttribute('data-bind');

        // Make a copy of the element node to be copied for each repetition
        var cleanNode = element.cloneNode(true);
        if (repeatBind)
            cleanNode.setAttribute('data-bind', repeatBind);

        // Original element is no longer needed: delete it and create a placeholder comment
        var parent = element.parentNode, placeholder = document.createComment('ko_repeatplaceholder');
        parent.replaceChild(placeholder, element);

        // set up persistent data
        var lastRepeatCount = 0,
            repeatUpdate = ko.observable();

        var subscribable = ko.dependentObservable(function() {
            var repeatCount = ko.utils.unwrapObservable(valueAccessor()), repeatArray;
            if (typeof repeatCount == 'object') {
                if ('count' in repeatCount) {
                    repeatCount = ko.utils.unwrapObservable(repeatCount['count']);
                } else if ('foreach' in repeatCount) {
                    repeatArray = ko.utils.unwrapObservable(repeatCount['foreach']);
                    repeatCount = repeatArray && repeatArray['length'] || 0;
                }
            }
            // Remove nodes from end if array is shorter
            for (; lastRepeatCount > repeatCount; lastRepeatCount--) {
                ko.removeNode(placeholder.previousSibling);
            }

            // Notify existing nodes of change
            repeatUpdate["notifySubscribers"]();

            // Add nodes to end if array is longer (also initially populates nodes)
            for (; lastRepeatCount < repeatCount; lastRepeatCount++) {
                // Clone node and add to document
                var newNode = cleanNode.cloneNode(true);
                parent.insertBefore(newNode, placeholder);
                newNode.setAttribute('data-repeat-index', lastRepeatCount);

                // Apply bindings to inserted node
                var newContext = ko.utils.extend(new bindingContext.constructor(), bindingContext);
                newContext[repeatIndex] = lastRepeatCount;
                if (repeatArray)
                    newContext[repeatData] = makeArrayItemAccessor(repeatArray, lastRepeatCount, repeatUpdate);
                ko.applyBindings(newContext, newNode);
            }
        }, null, {'disposeWhenNodeIsRemoved': placeholder});

        return { 'controlsDescendantBindings': true, 'subscribable': subscribable };
    }
};
})();

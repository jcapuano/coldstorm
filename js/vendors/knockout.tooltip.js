ko.bindingHandlers.tooltip = {
    defaultTooltipOptions: {
        style: { classes: "ui-tooltip-rounded ui-tooltip-blue ui-tooltip-shadow" },
        position: { viewport: $(window) }
    },
    getBehaviour: function (bindings) {
        var behaviour = {};
        if (typeof bindings == "string")
        { behaviour.content = bindings; }
        else {
            behaviour.content = {
                text: bindings.content,
                title: { text: bindings.title }
            };
            behaviour = $.extend(behaviour, bindings.options);
        }
        return $.extend(ko.bindingHandlers.tooltip.defaultTooltipOptions, behaviour);
    },
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();
        var tooltipBindings = allBindings.tooltip;
        var behaviour = ko.bindingHandlers.tooltip.getBehaviour(tooltipBindings);
        $(element).qtip(behaviour);
    }
};
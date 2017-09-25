/**
 * Created by prasanna_d on 9/25/2017.
 */
app.directive('wysiwyg', function($document) {
    return {
        restrict: "A",
        require: "ngModel",
        template: "<textarea style='width: 100%;height:100%'></textarea>",
        replace: true,
        link: function (scope, element, attrs, controller) {
            let styleSheets,
                synchronize,
                wysihtml5ParserRules = {
                    tags: {
                        b:{},
                        i:{},
                        br:{}
                    }
                };

            let editor = new wysihtml5.Editor(element[0], {
                parserRules:  wysihtml5ParserRules
            });

            synchronize = function() {
                controller.$setViewValue(editor.getValue());
                scope.$apply();
            };

            // scope.updateModel = function() {controller.ngChange();};

            editor.on('redo:composer', synchronize);
            editor.on('undo:composer', synchronize);
            editor.on('paste', synchronize);
            editor.on('aftercommand:composer', synchronize);
            editor.on('change', synchronize);

            // the secret sauce to update every keystroke, may be cheating but it works
            editor.on('load', function() {
                wysihtml5.dom.observe(
                    editor.currentView.iframe.contentDocument.body,
                    ['keyup'], synchronize);
            });

            // handle changes to model from outside the editor
            scope.$watch(attrs.ngModel, function(newValue) {
                // necessary to prevent thrashing
                if (newValue && (newValue !== editor.getValue())) {
                    element.html(newValue);
                    editor.setValue(newValue);
                }
            });
        }
    };
});
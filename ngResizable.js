var app = angular.module("myApp", []);

app.directive("ngResizable", function ($document) {
    return {
        restrict: "AE",
        scope: {
            resizeHandels: "="
        },
        link: function ($scope, $element, $attr) {
            //Reference to the original 
            var $mouseDown;

            // Function to manage resize up event
            var resizeUp = function ($event) {
                var margin = 50,
                    lowest = $mouseDown.top + $mouseDown.height - margin,
                    top = $event.pageY > lowest ? lowest : $event.pageY,
                    height = $mouseDown.top - top + $mouseDown.height;

                $element.css({
                    top: top + "px",
                    height: height + "px"
                });
            };

            // Function to manage resize right event
            var resizeRight = function ($event) {
                var margin = 50,
                    leftest = $element[0].offsetLeft + margin,
                    width = $event.pageX > leftest ? $event.pageX - $element[0].offsetLeft : margin;

                $element.css({
                    width: width + "px"
                });
            };

            // Function to manage resize down event
            var resizeDown = function ($event) {
                var margin = 50,
                    uppest = $element[0].offsetTop + margin,
                    height = $event.pageY > uppest ? $event.pageY - $element[0].offsetTop : margin;

                $element.css({
                    height: height + "px"
                });
            };

            // Function to manage resize left event
            function resizeLeft($event) {
                var margin = 50,
                    rightest = $mouseDown.left + $mouseDown.width - margin,
                    left = $event.pageX > rightest ? rightest : $event.pageX,
                    width = $mouseDown.left - left + $mouseDown.width;

                $element.css({
                    left: left + "px",
                    width: width + "px"
                });
            };

            var createResizer = function createResizer(className, handlers) {

                newElement = angular.element('<div class="' + className + '"></div>');
                $element.append(newElement);
                newElement.on("mousedown", function ($event) {

                    var newElement = angular.element('<div class="resizable"></div>');
                    $element.append(newElement);

                    $document.on("mousemove", mousemove);
                    $document.on("mouseup", mouseup);

                    //Keep the original event around for up / left resizing
                    $mouseDown = $event;
                    $mouseDown.top = $element[0].offsetTop;
                    $mouseDown.left = $element[0].offsetLeft
                    $mouseDown.width = $element[0].offsetWidth;
                    $mouseDown.height = $element[0].offsetHeight;

                    function mousemove($event) {
                        $event.preventDefault();
                        for (var i = 0 ; i < handlers.length ; i++) {
                            handlers[i]($event);
                        }
                    }

                    function mouseup() {
                        newElement.remove();
                        $document.off("mousemove", mousemove);
                        $document.off("mouseup", mouseup);
                    }
                });
            }

            if ($scope.resizeHandels && $scope.resizeHandels.length) {
                for (var i = 0; i < $scope.resizeHandels.length; i++) {
                    switch ($scope.resizeHandels[i]) {
                        case 'u':
                            createResizer('n-resize', [resizeUp]);
                            break;
                        case 'r':
                            createResizer('e-resize', [resizeRight]);
                            break;
                        case 'd':
                            createResizer('s-resize', [resizeDown]);
                            break;
                        case 'l':
                            createResizer('w-resize', [resizeLeft]);
                            break;
                        case 'ul':
                            createResizer('nw-resize', [resizeUp, resizeLeft]);
                            break;
                        case 'ur':
                            createResizer('ne-resize', [resizeUp, resizeRight]);
                            break;
                        case 'dr':
                            createResizer('se-resize', [resizeDown, resizeRight]);
                            break;
                        case 'dl':
                            createResizer('sw-resize', [resizeDown, resizeLeft]);
                            break;
                    };
                };
            } else {
                createResizer('se-resize', [resizeDown, resizeRight]);
                createResizer('e-resize', [resizeRight]);
                createResizer('s-resize', [resizeDown]);
            };
        }
    };
});
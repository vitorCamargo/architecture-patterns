export default () => Object({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "	<li class=\"hdr-bnr-item sz sz-"
    + container.escapeExpression((helpers.counter || (depth0 && depth0.counter) || alias2).call(alias1,(data && data.index),{"name":"counter","hash":{},"data":data,"blockParams":blockParams}))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[0][0]) != null ? stack1.backgroundColor : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[0][0]) != null ? stack1.linkUrl : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depths[1] != null ? depths[1].background : depths[1]),{"name":"toboolean","hash":{},"data":data,"blockParams":blockParams}),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.program(8, data, 0, blockParams, depths),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[0][0]) != null ? stack1.linkUrl : stack1),{"name":"if","hash":{},"fn":container.program(23, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "	</li>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return " style=\"background-color: "
    + ((stack1 = container.lambda(((stack1 = blockParams[1][0]) != null ? stack1.backgroundColor : stack1), depth0)) != null ? stack1 : "")
    + ";\"";
},"4":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda;

  return "		<a href=\""
    + ((stack1 = alias1(((stack1 = blockParams[1][0]) != null ? stack1.linkUrl : stack1), depth0)) != null ? stack1 : "")
    + "\" class=\"hdr-bnr-link\" title=\""
    + container.escapeExpression(alias1(((stack1 = blockParams[1][0]) != null ? stack1.alternateText : stack1), depth0))
    + "\">\n";
},"6":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "			<div class=\"hdr-bnr-image\" title=\""
    + ((stack1 = container.lambda(((stack1 = blockParams[1][0]) != null ? stack1.alternateText : stack1), depth0)) != null ? stack1 : "")
    + "\" data-style=\"background-image: url('"
    + ((stack1 = (helpers.bestbanner || (depth0 && depth0.bestbanner) || helpers.helperMissing).call(depth0 != null ? depth0 : {},blockParams[1][0],{"name":"bestbanner","hash":{},"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "')\"></div>\n";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression;

  return "		<picture class=\"hdr-bnr-image\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[1][0]) != null ? stack1.extralarge : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[1][0]) != null ? stack1.large : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[1][0]) != null ? stack1.big : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[1][0]) != null ? stack1.medium : stack1),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = blockParams[1][0]) != null ? stack1.small : stack1),{"name":"if","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "			<img "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[1] != null ? depths[1].banner : depths[1])) != null ? stack1.nolazy : stack1),{"name":"if","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.program(21, data, 0, blockParams, depths),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + " alt=\""
    + alias3(alias2(((stack1 = blockParams[1][0]) != null ? stack1.alternateText : stack1), depth0))
    + "\" title=\""
    + alias3(alias2(((stack1 = blockParams[1][0]) != null ? stack1.alternateText : stack1), depth0))
    + "\"/>\n		</picture>\n";
},"9":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "			<source srcset="
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? stack1.extralarge : stack1), depth0))
    + " media=\"(min-width: 1280px)\" />\n";
},"11":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "			<source srcset="
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? stack1.large : stack1), depth0))
    + " media=\"(min-width: 1025px)\" />\n";
},"13":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "			<source srcset="
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? stack1.big : stack1), depth0))
    + " media=\"(min-width: 768px)\" />\n";
},"15":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "			<source srcset="
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? stack1.medium : stack1), depth0))
    + " media=\"(min-width: 480px)\" />\n";
},"17":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "				<source srcset="
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? stack1.small : stack1), depth0))
    + " media=\"(max-width: 479px)\" />\n";
},"19":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "src=\""
    + ((stack1 = (helpers.bestbanner || (depth0 && depth0.bestbanner) || helpers.helperMissing).call(depth0 != null ? depth0 : {},blockParams[2][0],{"name":"bestbanner","hash":{},"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\"";
},"21":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "data-src=\""
    + ((stack1 = (helpers.bestbanner || (depth0 && depth0.bestbanner) || helpers.helperMissing).call(depth0 != null ? depth0 : {},blockParams[2][0],{"name":"bestbanner","hash":{},"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\"";
},"23":function(container,depth0,helpers,partials,data) {
    return "		</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<ul class=\"header-banner sizer szr-"
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.banner : depth0)) != null ? stack1.component : stack1)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1), depth0))
    + "\" data-pos=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.banner : depth0)) != null ? stack1.position : stack1), depth0))
    + "\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = (depth0 != null ? depth0.banner : depth0)) != null ? stack1.component : stack1)) != null ? stack1.children : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "</ul>";
},"useData":true,"useDepths":true,"useBlockParams":true});
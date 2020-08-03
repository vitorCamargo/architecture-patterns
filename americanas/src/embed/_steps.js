export default () => Object({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "	<li class=\"stp-item "
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,(helpers.lt || (depth0 && depth0.lt) || alias2).call(alias1,(data && data.index),((stack1 = (depths[1] != null ? depths[1].steps : depths[1])) != null ? stack1.current : stack1),{"name":"lt","hash":{},"data":data}),(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(data && data.index),((stack1 = (depths[1] != null ? depths[1].steps : depths[1])) != null ? stack1.current : stack1),{"name":"eq","hash":{},"data":data}),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n		<div class=\"stp-it-wpr\">\n"
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),(helpers.lt || (depth0 && depth0.lt) || alias2).call(alias1,(data && data.index),((stack1 = (depths[1] != null ? depths[1].steps : depths[1])) != null ? stack1.current : stack1),{"name":"lt","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.program(16, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "		</div>\n	</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "completed";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<svg class=\"stp-icon\" aria-labelledby=\"stp-title\" role=\"img\">\n					<use xlink:href=\"#bhf_icon-cart-check\"></use>\n					<title id=\"stp-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.cartTitle : stack1), depth0))
    + "</title>\n				</svg>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return ((stack1 = helpers["if"].call(alias1,(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.steps : depth0)) != null ? stack1.finance : stack1)) != null ? stack1.active : stack1),(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(data && data.index),((stack1 = (depths[1] != null ? depths[1].steps : depths[1])) != null ? stack1.current : stack1),{"name":"eq","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.program(9, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<svg class=\"stp-icon icon-current\" aria-labelledby=\"stp-title\" role=\"img\">\n					<use xlink:href=\"#bhf_icon-cart\"></use>\n					<title id=\"stp-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.cartTitle : stack1), depth0))
    + "</title>\n				</svg>\n";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || helpers.helperMissing).call(alias1,(data && data.index),((stack1 = ((stack1 = (depths[1] != null ? depths[1].steps : depths[1])) != null ? stack1.finance : stack1)) != null ? stack1.iconStep : stack1),{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.program(12, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "          <svg class=\"stp-icon icon-finance\" aria-labelledby=\"stp-title\" role=\"img\">\n            <use xlink:href=\"#bhf_icon-brand-card\"></use>\n            <title id=\"stp-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.financeIcon : stack1), depth0))
    + "</title>\n          </svg>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <svg class=\"stp-icon completed-icon\" aria-labelledby=\"stp-title\" role=\"img\">\n              <use xlink:href=\"#bhf_icon-check\"></use>\n              <title id=\"stp-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.cartTitle : stack1), depth0))
    + "</title>\n            </svg>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "				<a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" class=\"stp-label\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var helper;

  return "				<span class=\"stp-label\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<ul id=\""
    + alias3(((helper = (helper = helpers.headerPrefix || (depth0 != null ? depth0.headerPrefix : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"headerPrefix","hash":{},"data":data}) : helper)))
    + "steps\" class=\"current-step-"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.steps : depth0)) != null ? stack1.current : stack1), depth0))
    + " "
    + alias3((helpers.getHiddenClass || (depth0 && depth0.getHiddenClass) || alias2).call(alias1,(depth0 != null ? depth0.steps : depth0),{"name":"getHiddenClass","hash":{},"data":data}))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.steps : depth0)) != null ? stack1.items : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true,"useDepths":true});
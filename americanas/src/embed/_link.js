export default () => Object({"1":function(container,depth0,helpers,partials,data) {
    return " lks-hash";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"url","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "#";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\" title=\""
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)));
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\" tabindex=\""
    + container.escapeExpression(((helper = (helper = helpers.tabIndex || (depth0 != null ? depth0.tabIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"tabIndex","hash":{},"data":data}) : helper)));
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "		<svg class=\"lks-ico\" role=\"img"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.fill : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n			<use xlink:href=\"#"
    + ((stack1 = ((helper = (helper = helpers.svg || (depth0 != null ? depth0.svg : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"svg","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"></use>\n		</svg>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\" style=\"fill: "
    + container.escapeExpression(((helper = (helper = helpers.fill || (depth0 != null ? depth0.fill : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"fill","hash":{},"data":data}) : helper)))
    + ";";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"lks-txt\">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper)))
    + "</span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<a class=\"lks-link"
    + ((stack1 = helpers.unless.call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.title : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.tabIndex : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.svg : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,(depth0 != null ? depth0.text : depth0),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</a>\n";
},"useData":true});
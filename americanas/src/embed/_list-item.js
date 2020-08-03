export default () => Object({"1":function(container,depth0,helpers,partials,data) {
    return " highlight";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1), depth0)) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "#";
},"7":function(container,depth0,helpers,partials,data) {
    return "rel=\"nofollow\"";
},"9":function(container,depth0,helpers,partials,data) {
    return "target=\"_blank\"";
},"11":function(container,depth0,helpers,partials,data) {
    return "			<svg class=\"highlight-icon\" role=\"img\">\n				<use xlink:href=\"#bhf_brand-simple\"></use>\n			</svg>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials._list,depth0,{"name":"_list","hash":{"level":(helpers.counter || (depth0 && depth0.counter) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.level : depth0),{"name":"counter","hash":{},"data":data}),"list":(depth0 != null ? depth0.item : depth0)},"data":data,"indent":"\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"lst-item"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.highlight : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n	<a href=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\" title=\""
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\" class=\"lst-lnk rp\" "
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.rel : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.target : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.highlight : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n	</a>\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</li>\n";
},"usePartial":true,"useData":true});
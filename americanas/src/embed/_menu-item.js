export default () => Object({"1":function(container,depth0,helpers,partials,data) {
    return "has-children";
},"3":function(container,depth0,helpers,partials,data) {
    return " mmn-submenu";
},"5":function(container,depth0,helpers,partials,data) {
    return " todas-as-lojas";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<a href=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\" class=\"mmn-itm-link"
    + ((stack1 = helpers.unless.call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1),{"name":"unless","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " itm-lnk-level-"
    + alias3((helpers.counter || (depth0 && depth0.counter) || alias2).call(alias1,(depth0 != null ? depth0.level : depth0),{"name":"counter","hash":{},"data":data}))
    + "\">\n			"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n			"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.flag : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,(helpers.get || (depth0 && depth0.get) || alias2).call(alias1,(data && data.root),((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.position : stack1),{"name":"get","hash":{},"data":data}),(helpers.ne || (depth0 && depth0.ne) || alias2).call(alias1,((stack1 = (data && data.root)) && stack1.mobile),true,{"name":"ne","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</a>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1), depth0)) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "#";
},"12":function(container,depth0,helpers,partials,data) {
    return " mmn-itm-hash";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"mmn-itm-flag mmn-itm-"
    + container.escapeExpression((helpers.toclass || (depth0 && depth0.toclass) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.flag : stack1),{"name":"toclass","hash":{},"data":data}))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.flag : stack1), depth0)) != null ? stack1 : "")
    + "</span>";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "			<svg class=\"mmn-arrow\" aria-labelledby=\"mmn-arw-title\" role=\"img\">\n				<use xlink:href=\"#bhf_icon-arrow\"></use>\n				<title id=\"mmn-arw-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.title : stack1), depth0))
    + "</title>\n			</svg>\n";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<span class=\"mmn-itm-link"
    + ((stack1 = helpers.unless.call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1),{"name":"unless","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " itm-lnk-level-"
    + alias3((helpers.counter || (depth0 && depth0.counter) || alias2).call(alias1,(depth0 != null ? depth0.level : depth0),{"name":"counter","hash":{},"data":data}))
    + "\">\n			"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n			"
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.flag : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,(helpers.get || (depth0 && depth0.get) || alias2).call(alias1,(data && data.root),((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.position : stack1),{"name":"get","hash":{},"data":data}),(helpers.ne || (depth0 && depth0.ne) || alias2).call(alias1,((stack1 = (data && data.root)) && stack1.mobile),true,{"name":"ne","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</span>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["_menu-panel"],depth0,{"name":"_menu-panel","hash":{"back":1,"level":(helpers.counter || (depth0 && depth0.counter) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.level : depth0),{"name":"counter","hash":{},"data":data}),"panel":(depth0 != null ? depth0.item : depth0)},"data":data,"indent":"\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<li class=\"mmn-item  "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,(helpers.get || (depth0 && depth0.get) || alias2).call(alias1,(data && data.root),((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.position : stack1),{"name":"get","hash":{},"data":data}),(helpers.ne || (depth0 && depth0.ne) || alias2).call(alias1,((stack1 = (data && data.root)) && stack1.mobile),true,{"name":"ne","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " sz sz-"
    + container.escapeExpression((helpers.counter || (depth0 && depth0.counter) || alias2).call(alias1,(data && data.index),{"name":"counter","hash":{},"data":data}))
    + ((stack1 = helpers["if"].call(alias1,(helpers.toboolean || (depth0 && depth0.toboolean) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.highlight : stack1),{"name":"toboolean","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.link : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(18, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.children : stack1)) != null ? stack1.length : stack1),(helpers.and || (depth0 && depth0.and) || alias2).call(alias1,(helpers.ne || (depth0 && depth0.ne) || alias2).call(alias1,((stack1 = (data && data.root)) && stack1.mobile),true,{"name":"ne","hash":{},"data":data}),(helpers.get || (depth0 && depth0.get) || alias2).call(alias1,(data && data.root),((stack1 = (depth0 != null ? depth0.item : depth0)) != null ? stack1.position : stack1),{"name":"get","hash":{},"data":data}),{"name":"and","hash":{},"data":data}),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</li>\n";
},"usePartial":true,"useData":true});
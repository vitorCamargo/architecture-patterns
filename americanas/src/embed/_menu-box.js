export default () => Object({"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["_menu-panel"],depth0,{"name":"_menu-panel","hash":{"level":0,"panel":blockParams[0][0]},"data":data,"blockParams":blockParams,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "<div class=\"box mmn-box\">\n	<div class=\"mmn-box-wpr\">\n		<span class=\"mmn-title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.msg : depth0)) != null ? stack1.menuTitle : stack1), depth0))
    + "</span>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = (depth0 != null ? depth0.menu : depth0)) != null ? stack1.component : stack1)) != null ? stack1.children : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "	</div>\n</div>";
},"usePartial":true,"useData":true,"useBlockParams":true});
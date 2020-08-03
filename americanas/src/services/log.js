
import buildData from './../embed/build-data';

function Log(msg, value = null, prefix = '[FEATHER LOG] ', env = buildData.environment, _console=console){
	if(env === 'development' || /log=true/.test(location.search)) {
		if(typeof _console !== 'undefined') {
			if (value === null) {
				_console.log(prefix, msg);
			} else {
				_console.log(prefix + msg, value);
			}
		}
	}
}

const LogError = (msg, value = null, prefix = '[FEATHER ERROR] ') =>
	Log(msg, value, prefix);

export { Log, LogError };

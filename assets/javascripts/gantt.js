//= require snap
//= require moment
//= require frappe-gnatt

var RailsGantt = function(element, taskJSON) {
	var formattedTasks = function(tasks) {
		tasks.forEach(function(task) {
			task.end = task.finish;
			task.id = task.id.toString();
			delete task.finish;
		});
		return tasks;
	}

	this.tasks = formattedTasks(taskJSON);
	this.create(element);
}

RailsGantt.prototype.sendToServer = function() {
	document.getElementById("gnatt_tasks_input").setAttribute("value", JSON.stringify({tasks: this.tasks}));
	document.getElementById("hidden_gantt_form").submit();	
}

RailsGantt.prototype.create = function(element) {
	var self = this;
	this.gantt = new Gantt(element, this.tasks, {
		on_date_change: function(changed_task, start, end) {
			self.tasks.forEach(function(task) {
				if (task.id === changed_task.id) {
					task.end = end["_d"].getFullYear() + "-" + (end["_d"].getMonth() + 1) + "-" + end["_d"].getDate();
					task.start = start["_d"].getFullYear() + "-" + (start["_d"].getMonth() + 1) + "-" + start["_d"].getDate();
				}
			});
			self.sendToServer();
		},
		on_progress_change: function(changed_task, start, end) {
			self.sendToServer();
		}
	});
}
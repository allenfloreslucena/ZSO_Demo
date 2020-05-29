/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"gs/ZSO_Demo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
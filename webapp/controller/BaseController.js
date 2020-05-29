sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function(Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("gs.ZSO_Demo.controller.BaseController", {
		
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},
		
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		
		/* =========================================================== */
		/* Arrow back button Function                                  */
		/* =========================================================== */
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Home", {}, true /*no history*/);
			}
			var oSource = oEvent.getSource();
			if(oSource.oParent.sViewName === "gs.ZSO_Demo.view.View"){
				var oTable = this.getView().byId("viewTable");
				oTable.getModel().refresh(true);	
			}
			
		}

	});

});
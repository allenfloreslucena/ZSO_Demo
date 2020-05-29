sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("gs.ZSO_Demo.controller.View", {
		onInit: function () {
			this.getRouter().getRoute("View").attachPatternMatched(this._onObjectMatched, this);
		},
		
		handleRefresh: function () {
				this._refreshItem();
				this.byId("pullToRefresh").hide();
		},
		
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		_refreshItem: function () {
			var oTable = this.getView().byId("viewTable");
			oTable.getModel().refresh(true);
		},
		
		_onObjectMatched: function(oEvent) {
			var sVbeln = oEvent.getParameter("arguments").Vbeln; //get parameter from home sales order input field
						
			if (!sVbeln) {
				return;
			}
	
			this.getModel().metadataLoaded().then(function () {
				var sVbelnPath = this.getModel().createKey("SOHeaderCollection", {
					Vbeln: sVbeln
				});
				this._bindView("/" + sVbelnPath);
			}.bind(this));
		},
		
		_bindView: function (sVbelnPath) {
			var that = this;
			this.getView().bindElement({
				path: sVbelnPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						that.getView().setBusyIndicatorDelay(0);
						that.getView().setBusy(true);
					},
					dataReceived: function () {
						that.getView().setBusy(false);
					}
				}
			});
		},
		
		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("NotFound");
				return;
			}
		}
	});
});

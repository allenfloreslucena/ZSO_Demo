sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, UIComponent, MessageToast, MessageBox) {
	"use strict";
		
	return BaseController.extend("gs.ZSO_Demo.controller.Home", {
		
		onInit: function () {
			// Header input object initialization
			this.oOrderType = this.getView().byId("inOrder");
			this.oSalesOrg  = this.getView().byId("inSalesOrg");
			this.oDistChan  = this.getView().byId("inDistChan");
			this.oDivision  = this.getView().byId("inDiv");
			this.oSoldTo    = this.getView().byId("inSoldTo");
			this.oPONum     = this.getView().byId("inPONum");
			
			// Item input object initialization
			this.oItem     = this.getView().byId("inItem");
			this.oMaterial = this.getView().byId("inMaterial");
			this.oQuan     = this.getView().byId("inQuan");
			this.oPlant    = this.getView().byId("inPlant");
			
			// Create button initialization
			this.btnCreate = this.getView().byId("btnCreate");
			
			var oModel = new JSONModel();
			this.getView().byId("packItem").setModel(oModel);
			
			
		},
	
		/* =========================================================== */
		/* Add button Function                                         */
		/* =========================================================== */
		OnAdd: function(oEvt) {
			// Get the value of the header input fields
			var sOrderType = this.oOrderType.getValue();
			var sSalesOrg  = this.oSalesOrg.getValue();
			var oResource = this.getView().getModel("i18n").getResourceBundle();
			
			if (sOrderType === "" && sSalesOrg === "") {
				// Show error pop-up
				MessageBox.show(oResource.getText("headerRequired"), {
					icon: MessageBox.Icon.ERROR,
					title: oResource.getText("messageTitle"),
					actions: MessageBox.Action.CLOSE
				});
			} else {
				// Get the value of the item input fields.
				var sItem      = this.oItem.getValue();
				var sMaterial  = this.oMaterial.getValue();
				var sQuan 	   = this.oQuan.getValue();
				var sPlant     = this.oPlant.getValue();
				
				// Check if required field is not empty.
				if (sMaterial !== "" && sQuan !== "" && sPlant !== "")
				{
					// Push item entry into array and bind it to the table
					var itemRow = {
						Item: sItem,
						Material: sMaterial,
						Quantity: sQuan,
						Plant: sPlant
					};
					
					// Get View Model
					var oModel   = this.getView().byId("packItem").getModel();
					var itemData = oModel.getProperty("/data");
					
					if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
						itemData.push(itemRow);
					} else {
						itemData = [];
						itemData.push(itemRow);
					}
				
					// Set model data 
					oModel.setData({
						data: itemData
					});
					
					// Clear item input field values
					this.oItem.setValue("");
					this.oMaterial.setValue("");
					this.oQuan.setValue("");
					this.oPlant.setValue("");
					
					// Enable create button
					this.btnCreate.setEnabled(true);
					MessageToast.show("Item successfully added.");
				} else {
					// If required field is empty then throw error message.
					MessageBox.show(oResource.getText("itemRequired"), {
						icon: MessageBox.Icon.ERROR,
						title: oResource.getText("messageTitle"),
						actions: MessageBox.Action.CLOSE
					});
				}
			}
				
		},
		
		/* =========================================================== */
		/* View button Function                                        */
		/* =========================================================== */
		onViewPress: function(oEvt) {
			// Get order number from input field.
			var vbeln = this.getView().byId("inSONumber");
			var oResource = this.getView().getModel("i18n").getResourceBundle();
			
			if(vbeln.getValue() === "") {
				MessageBox.show(oResource.getText("viewRequired"), {
					icon: MessageBox.Icon.ERROR,
					title: oResource.getText("messageTitle"),
					actions: MessageBox.Action.CLOSE
				});
			} else {
				// Navigate to view page and show order details.
				this.getRouter().navTo("View", {
					Vbeln: vbeln.getValue()
				}, true);
				vbeln.setValue("");
			}
			
			this._clearFields();
			this._clearTable();
		},
		
		/* =========================================================== */
		/* Create button Function                                      */
		/* =========================================================== */
		OnCreate: function (oEvt) {
			var that = this;
//			MessageToast.show("Creating Items...");
			// Make page busy
			// sap.ui.core.BusyIndicator.show(10);
			this.getView().setBusyIndicatorDelay(0);
			this.getView().setBusy(true);
			// setTimeout(function () {
			// 	that.getView().setBusy(false);
			// }, 1000);
			
			// var oDialog = this.byId("BusyDialog");
			// oDialog.open();

			// jQuery.sap.delayedCall(3000, this, function () {
			// 	oDialog.close();
			// });
			var oTable = this.getView().byId("packItem");
			var oModel = oTable.getModel();
			var aItems = oTable.getItems();
			
			// Get the value of the header input fields
			var sOrderType = this.oOrderType.getValue().toUpperCase();
			var sSalesOrg = this.oSalesOrg.getValue();
			var sDistChan = this.oDistChan.getValue();
			var sDivision = this.oDivision.getValue();
			var sSoldTo = this.oSoldTo.getValue();
			var sPONum = this.oPONum.getValue();
			
		//Begin of oDataService's Request Preparation------------------
			var oSrvRequest = {}; //Object to contain input
			var aItemData = []; //Array to accept item level
			
			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
				var sItem = oModel.getProperty("Item", aItems[iRowIndex].getBindingContext());
				var sMaterial = oModel.getProperty("Material", aItems[iRowIndex].getBindingContext());
				var sQuantity = oModel.getProperty("Quantity", aItems[iRowIndex].getBindingContext());
				var sPlant = oModel.getProperty("Plant", aItems[iRowIndex].getBindingContext());
			
				aItemData.push({
					Posnr: sItem,
					Matnr: sMaterial.toUpperCase(),
					Dzmeng: sQuantity,
					Werks: sPlant
				});
			}
			
			//Header Input
			oSrvRequest.Auart = sOrderType;
			oSrvRequest.Vkorg = sSalesOrg;
			oSrvRequest.Vtweg = sDistChan;
			oSrvRequest.Spart = sDivision;
			oSrvRequest.Bstnk = sPONum;
			oSrvRequest.Parvw = "AG";
			oSrvRequest.Kunnr = sSoldTo;
			
			//ItemSet
			oSrvRequest.SO_ITEMSet = aItemData;
		//End of oDataService's Request Preparation--------------------

			//Odata Service URL Access: when running app from Eclipse	
			//var sURL = "proxy/http/192.168.3.36:8080//sap/opu/odata/sap/ZSODATA_SO_MULTILINE_SRV/";
			
			//Odata Service URL Access: when running app from webIDE/FLP	
			var sURL = "/sap/opu/odata/sap/ZSODATA_SO_MULTILINE_SRV/";
			var oModel1 = new sap.ui.model.odata.ODataModel(sURL, true);
			this.getView().setModel(oModel1/*, 'salesorder'*/);
	
		// /***** inserted 10/24/2019 -- begin *****/
		//     // var sServiceUrl = "URL";
		// 	var busyIndicator = sap.ui.core.BusyIndicator;
		// 		$(function(){
  //                  var oModel1 = new sap.ui.model.odata.v2.ODataModel({serviceUrl: sURL});
  //                  oModel.setSizeLimit(20);
  //                  oModel.attachRequestFailed(function(evt) {
  //                  	var oJsonModel = new sap.ui.model.json.JSONModel(Device);
  //                  		oJsonModel.setDefaultBindingMode("OneWay");
  //                  		oJsonModel.setData([]);
  //                  		that.setModel(oJsonModel,"userlistModel");
  //                  	});
  //                       // BusyDialog
  //                          oModel1.attachRequestSent(function(){
  //                             busyIndicator.show(0);
  //                          });
  //                         oModel1.attachRequestCompleted(function(){
  //                           busyIndicator.hide();
  //                         });
  //                        oModel1.callFunction("/SOHeaderCollection","POST",oSrvRequest, null,
  //                      		function(oData, oResponse) {
  //                              		var sMessage = oResponse.headers["sap-message"];
		// 			var oMessage = JSON.parse(sMessage);
							 
		// 			MessageBox.show(oMessage.message, {
		// 				icon: MessageBox.Icon.SUCCESS,
		// 				title: oMessage.severity,
		// 				actions: MessageBox.Action.OK,
		// 				onClose: function(oAction) {
		// 					that.getView().setBusy(false);
							
		// 					var oTable1 = that.getView().byId("packItem");
		// 					var oModel2 = oTable1.getModel();
		// 					oModel2.setData(null);
							
		// 					that.oOrderType.setValue("");
		// 				    that.oSalesOrg.setValue("");
		// 					that.oDistChan.setValue("");
		// 					that.oDivision.setValue("");
		// 					that.oSoldTo.setValue("");
		// 					that.oPONum.setValue("");

		// 					that.btnCreate.setEnabled(false);
		// 				}
		// 			});
  //                             },
  //                           function(oError) {
	 //                              	var sMessage = oError.response.body;
		// 			var oMessage = JSON.parse(sMessage);
					
		// 			MessageBox.show(oMessage.error.message.value, {
		// 				icon: MessageBox.Icon.ERROR,
		// 				title: oError.message,
		// 				actions: MessageBox.Action.CLOSE,
		// 				onClose: function (oAction) {
		// 					that.getView().setBusy(false);
		// 				}
		// 			});
  //                             });
  //                      });
                        
  //      /***** inserted 10/24/2019 -- end *****/
	
			// Calling Odata Service using OModel.create
			// Set HTTP Header
			oModel1.setHeaders({
				"X-Requested-With" : "XMLHttpRequest",
				"Content-Type" : "application/json",
				"DataServiceVersion" : "2.0",
				"Accept" : "application/atom+xml,application/atomsvc+xml,application/xml",
				"X-CSRF-Token" : ""
			});
			
			//Call the create request
		    oModel1.create("/SOHeaderCollection", oSrvRequest, {
				success: function(oData, oResponse) {
					var sMessage = oResponse.headers["sap-message"];
					var oMessage = JSON.parse(sMessage);
							 
					MessageBox.show(oMessage.message, {
						icon: MessageBox.Icon.SUCCESS,
						title: oMessage.severity,
						actions: MessageBox.Action.OK,
						onClose: function(oAction) {
							that.getView().setBusy(false);
							
							that._clearTable();
							/*var oTable1 = that.getView().byId("packItem");
							var oModel2 = oTable1.getModel();
							oModel2.setData(null);*/
							
							
							that._clearFields();
							/*that.oOrderType.setValue("");
						    that.oSalesOrg.setValue("");
							that.oDistChan.setValue("");
							that.oDivision.setValue("");
							that.oSoldTo.setValue("");
							that.oPONum.setValue("");*/

							that.btnCreate.setEnabled(false);
						}
					});		
				},
				error: function(oResponse) {
					var sMessage = oResponse.response.body;
					var oMessage = JSON.parse(sMessage);
					
					MessageBox.show(oMessage.error.message.value, {
						icon: MessageBox.Icon.ERROR,
						title: oResponse.message,
						actions: MessageBox.Action.CLOSE,
						onClose: function (oAction) {
							that.getView().setBusy(false);
						}
					});
				}
			});
		},
		
		/* =========================================================== */
		/* Delete button Function                                      */
		/* =========================================================== */
		onDelete: function() {
			var oTable = this.getView().byId("packItem");
			var oModel2 = oTable.getModel();
			var aRows = oModel2.getData().data;
			var aContexts = oTable.getSelectedContexts();

			// Loop backward from the Selected Rows
			if (aContexts.length > 0) {
				this.getView().byId("btnDelete").setEnabled(true);
			} else {
				this.getView().byId("btnDelete").setEnabled(true);
			}
			for (var i = aContexts.length - 1; i >= 0; i--) {
				// Selected Row
				var oThisObj = aContexts[i].getObject();
				 
				// $.map() is used for changing the values of an array.
				// Here we are trying to find the index of the selected row
				// refer - http://api.jquery.com/jquery.map/
				var iIndex = $.map(aRows, function(obj, index) {
				 	if (obj === oThisObj) {
						return index;
					}
				});
			 
				// The splice() method adds/removes items to/from an array
				// Here we are deleting the selected index row
				// https://www.w3schools.com/jsref/jsref_splice.asp
				 
				aRows.splice(iIndex, 1);
			}
			
			// Set the Model with the Updated Data after Deletion
			oModel2.setData({
				data: aRows
			});
			
			// Reset table selection in UI5
			oTable.removeSelections(true);
			
			// Check if table have items (disable create button if table has no item).
			var count= oTable.getItems().length;
			if(count <= 0 ) {
				this.btnCreate.setEnabled(false);
			}
		},
		
		/* =========================================================== */
		/* Inner method												   */
		/* =========================================================== */
	    _setHeaderEditable: function(bool) {
	    	this.oOrderType.setEditable(bool);
			this.oSalesOrg.setEditable(bool);
			this.oDistChan.setEditable(bool);
			this.oDivision.setEditable(bool);
			this.oSoldTo.setEditable(bool);
			this.oPONum.setEditable(bool);
	    },
		
		// TEST CLEAR
		_clearFields: function(oEvent) {
			this.oOrderType.setValue("");
		    this.oSalesOrg.setValue("");
			this.oDistChan.setValue("");
			this.oDivision.setValue("");
			this.oSoldTo.setValue("");
			this.oPONum.setValue("");
			
			this.oItem.setValue("");
			this.oMaterial.setValue("");
			this.oQuan.setValue("");
			this.oPlant.setValue("");
		},
		
		_clearTable: function(oEvent) {
			var oTable = this.getView().byId("packItem");
			var oModel = oTable.getModel();
			oModel.setData(null);
		}
	});
});
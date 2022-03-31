function fluixShouldSubmit() {
  var fluixUser = app.fluixUser;

  var isInOperations = fluixUser.groups.indexOf("Operations") !== -1;

  for (var i = 1; i <= 17; i++) {
    if (this.getField("Image" + i + "_check").value == "Off") {
      app.alert("Please make sure to add all the images required");
      return false;
    }
  }

  if (isInOperations) {
    this.getField("OperationsApprove").display = display.hidden;
  } else this.getField("OperationsApprove").display = display.visible;

  if (this.getField("OperationsApprove").value == "Checked") {
    this.getField("Image13_check").value = "Off";
    this.getField("Image14_check").value = "Off";
    this.getField("Image15_check").value = "Off";
    this.getField("Image16_check").value = "Off";
    this.getField("Image17_check").value = "Off";

    this.getField("Photo27_af_image").strokeColor = color.red;
    this.getField("Photo28_af_image").strokeColor = color.red;
    this.getField("Photo32_af_image").strokeColor = color.red;
    this.getField("Photo33_af_image").strokeColor = color.red;
    this.getField("Photo34_af_image").strokeColor = color.red;

    this.getField("signature-field-286").required = true;
    this.getField("signature-field-278").required = true;
  }

  return true;
}

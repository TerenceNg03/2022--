# Invoked by Doctor Frontend, in order to get the medicine information.
# URL: doctor_interface/querymedicine/
# Params: None
# Return: Information of all medicine : string
#   Return format:
#   [
#       [ID, Brand, Name, Description, Usage, Taboo, Price, ImageURL, Stock, Units],
#       ["001","国药","阿司匹林","解热镇痛","一日三次","三高人群",25.0,"https://s2.loli.net/2022/05/06/.png",50, "盒"]
#       ["002","国药","头孢","头孢就酒，越喝越勇","一日三次","三高人群",24.0,"https://s2.loli.net/2022/05/06/.png",10, "盒"],
#   ]
def QueryMedicine(Request : HttpRequest):
    # We only accept POST package
    if (Request.method != "POST"):
        return Http404
    # Use empty keywords, to search for all medicine
    SearchContent = ""
    # Use default branch
    BranchName=getAllBranch()[0]
    # Call the interface of the database
    Ret = searchMedicine(SearchContent, BranchName)
    # Return
    return HttpResponse(str(Ret))

# Invoked by Doctor Frontend, in order to add medicine to users' pharmacy cart.
# URL: doctor_interface/prescmedicine/
# Params: Json package of the bill
#   Params format:
#   {
#       "patient_id" : ... ,
#       "bill" : [
#                   {"medName": ..., "val": ...},
#                   {"medName": ..., "val": ...},
#                   {"medName": ..., "val": ...},
#                ]
#   }
# Return: 1 for success, 0 for failure
def PrescMedicine(Request : HttpRequest):
    # We only accept POST package
    if (Request.method != "POST"):
        return Http404
    # Decode package body
    Data = json.loads(Request.body.decode("utf-8"))
    # Get the user id from the package body
    UserID = Data.get("patient_id") # Type: str
    # Get the content of the prescription
    Prescription = Data.get("bill") # Type: list
    # Use default branch
    BranchName = getAllBranch()[0]
    # Call the interface of the database
    # TODO: Rollback the whole transaction when encountering a failure
    for Item in Prescription:
        Suc = addShoppingCart(UserID, Item.get("medName"), BranchName, Item.get("val"))
        if (not Suc):
            return HttpResponse(0)
    return HttpResponse(1)
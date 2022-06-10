package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"se_case_back_end/common"
	"se_case_back_end/model"
	"se_case_back_end/response"
)

type DoctorName struct {
	Real_name string
}

type DescriptionStr struct {
	Cc string
}

func GetRecordByPID(c *gin.Context) {
	id := c.Param("patient_id")
	db := common.GetDB()
	var records []model.Register
	if err := db.Model(&model.Register{}).Where("user_id = " + id).Order("id desc").Find(&records).Error; err != nil {
		response.Response(c, http.StatusUnprocessableEntity, 500, nil, "查询失败")
		return
	}
	var res []gin.H
	if len(records) > 0 {
		for i := 0; i < len(records); i++ {
			var docName DoctorName
			var Description DescriptionStr
			db.Raw("select real_name from management.user where id = ?", records[i].DoctorID).Scan(&docName)
			print(records[i].DoctorID, docName.Real_name, "\n")
			db.Raw("select cc from record.cases where register_id = ?", records[i].ID).Scan(&Description)
			print(records[i].ID, Description.Cc, "\n")
			res = append(res, gin.H{
				// 			"date": records[i].UpdatedAt.Format("2006-01-02 15:04:05"),
				// 			"url":  "/api/view/" + strconv.Itoa(int(records[i].ID)),
				"recordID":    records[i].ID,
				"doctorName":  docName.Real_name,
				"description": Description.Cc,
			})
		}

	} else {
		res = make([]gin.H, 0)
	}
	response.Success(c, gin.H{"data": res}, "用户所有挂号")
}

func GetRecord(c *gin.Context) {
	id := c.Param("id")
	db := common.GetDB()
	rg := model.Register{}
	if err := db.Model(&model.Register{}).Where("id = " + id).Take(&rg).Error; err != nil {
		response.Response(c, http.StatusBadRequest, 400, nil, "查询失败")
		return
	}
	//if rg.Department == "" {
	//	response.Response(c, http.StatusBadRequest, 400, nil, "该对象不存在")
	//}
	var sup []gin.H
	var tre []gin.H
	var docName DoctorName
	var Name DoctorName
	db.Raw("select real_name from management.user where id = ?", rg.DoctorID).Scan(&docName)
	db.Raw("select real_name from management.user where id = ?", rg.UserID).Scan(&docName)
	reg := gin.H{
		"id":   rg.ID,
		"name": Name.Real_name,
		//"age":        rg.Age,
		//"gender":     rg.Gender,
		//"department": rg.Department,
		//"status":     rg.Status,
		"regTime":    rg.CreatedAt.Format("2006-01-02 15:04:05"),
		"userID":     rg.UserID,
		"doctorName": docName.Real_name,
		"doctorID":   rg.DoctorID,
	}
	ca := model.Case{}
	if err := db.Model(&model.Case{}).Where("register_id = " + id).Take(&ca).Error; err != nil {
		response.Response(c, http.StatusBadRequest, 400, nil, "查询失败")
		return
	}
	cas := gin.H{
		"cc":   ca.CC,
		"hopi": ca.HOPI,
		"pmh":  ca.PMH,
		"pe":   ca.PE,
		"pd":   ca.PD,
		"rc":   ca.RC,
		"edu":  ca.EDU,
	}
	var sp []model.Supplement
	if err := db.Model(&model.Supplement{}).Where("clinic_id = " + id).Order("id desc").Find(&sp).Error; err != nil {
		response.Response(c, http.StatusUnprocessableEntity, 500, nil, "查询失败")
		return
	}
	for i := 0; i < len(sp); i++ {
		sup = append(sup, gin.H{
			"checkName": sp[i].CheckName,
			"result":    sp[i].Result,
		})
	}
	var tm []model.Treatment
	if err := db.Model(&model.Treatment{}).Where("clinic_id = " + id).Order("id desc").Find(&tm).Error; err != nil {
		response.Response(c, http.StatusUnprocessableEntity, 500, nil, "查询失败")
		return
	}
	for i := 0; i < len(tm); i++ {
		tre = append(tre, gin.H{
			"medName": tm[i].MedName,
			"val":     tm[i].Val,
			"unit":    tm[i].Unit,
			"usage":   tm[i].Usage,
		})
	}
	response.Success(c, gin.H{"reg": reg, "cas": cas, "sps": sup, "trs": tre}, "单次病历")

}

function getScenicsByCityCode(cityCode) {
	
	var scenicDAO = new com.itravel.util.MongoFactory().getScenicDAO();
	
	return {
		result : scenicDAO.getScenicsByCityCode(cityCode)
	};
}

function getCodeByName(cityName) {
	var cityDAO = new com.itravel.util.MongoFactory().getCityDAO();
	
	return {
		result : cityDAO.getCodeByName(cityName)
	};
}
function getScenicsByCityCode(cityCode) {
	
	var scenicDAO = new com.itravel.util.MongoFactory().getScenicDAO();
	
	return {
		result : scenicDAO.getScenicsByCityCode(cityCode)
	};
}
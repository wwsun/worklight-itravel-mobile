package com.itravel.dao;

import java.util.List;

import com.itravel.util.MongoFactory;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;

public class ScenicDAO {

	DBCollection scenicCollection;
	
	public ScenicDAO() {
		scenicCollection = MongoFactory.getDB().getCollection("scenics");
	}
	
	/**
	 * 
	 * @param cityCode
	 * @return the scenic list of a specific city
	 */
	public List<DBObject> getScenicsByCityCode(String cityCode) {
		
		List<DBObject> scenics;
		DBObject query = QueryBuilder.start("city_code").is(cityCode).get();
		DBCursor cursor = scenicCollection.find(query, new BasicDBObject("_id", false));
		scenics = cursor.toArray();
		cursor.close();
		
		//return JSON.serialize(scenics);
		
		return scenics;
		
	}
	
	/**
	 * 
	 * @param name
	 * @return specific scenic detail
	 */
	public List<DBObject> getScenicByName(String name) {
		
		return null;
	}
}

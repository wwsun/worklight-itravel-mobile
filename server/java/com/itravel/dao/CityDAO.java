package com.itravel.dao;

import java.util.List;

import com.itravel.util.MongoFactory;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;

public class CityDAO {
	DBCollection cityCollection;
	
	public CityDAO() {
		cityCollection = MongoFactory.getDB().getCollection("cities");
	}
	
	public List<DBObject> findCityList() {
		List<DBObject> cities;
		DBObject query = QueryBuilder.start().get();
		DBCursor cursor = cityCollection.find( query, new BasicDBObject("name", true).append("_id", false))
				.sort(new BasicDBObject().append("name", -1));
		cities = cursor.toArray();
		cursor.close();
		
		return cities;
	}
}

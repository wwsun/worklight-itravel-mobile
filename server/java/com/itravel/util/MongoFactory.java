package com.itravel.util;

import java.net.UnknownHostException;

import com.itravel.dao.CityDAO;
import com.itravel.dao.ScenicDAO;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;

public class MongoFactory {
	public static final String mongoURIString = "mongodb://192.168.191.1";
	public static final String dbName = "itravel";
	
	public static DB getDB() {
		MongoClient mongoClient;
		DB travelDB = null;
		try {
			mongoClient = new MongoClient(new MongoClientURI(mongoURIString));
			travelDB = mongoClient.getDB(dbName);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return travelDB;
	}
	
	public CityDAO getCityDAO() {
		return new CityDAO();
	}
	
	public ScenicDAO getScenicDAO() {
		return new ScenicDAO();
	}
}

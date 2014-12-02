package com.itravel.demo;

import java.util.List;

import com.itravel.dao.CityDAO;
import com.itravel.util.MongoFactory;
import com.mongodb.DBObject;

public class Demo1 {
	public static void main(String[] args){
		
		//MongoFactory factory = new MongoFactory();
//		ScenicDAO dao = new MongoFactory().getScenicDAO();
//		List<DBObject> result = dao.getScenicsByCityCode("NJ");
//		//System.out.println(result);
//		
//		printResult(result);
		
		CityDAO cityDao = new MongoFactory().getCityDAO();
		String result = cityDao.getCodeByName("ÄÏ¾©ÊÐ");
		System.out.println(result);
	}
	
	public static void printResult(List<DBObject> list) {
		for(DBObject obj:list){
			System.out.println(obj.get("name"));
			System.out.println(obj.get("icon"));
			System.out.println(obj.get("info"));
		}
	}
}

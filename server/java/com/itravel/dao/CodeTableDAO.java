package com.itravel.dao;

import java.util.List;

import com.itravel.util.MongoFactory;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.mongodb.util.JSON;

public class CodeTableDAO {
DBCollection codeTableCollection;
	
	public CodeTableDAO() {
		codeTableCollection = MongoFactory.getDB().getCollection("codeTable");
	}
	
	public String getCodeTable() {
		List<DBObject> table;
		DBObject query = QueryBuilder.start().get();
		DBCursor cursor = codeTableCollection.find( query, new BasicDBObject("_id", false))
				.sort(new BasicDBObject().append("city", -1));
		table = cursor.toArray();
		cursor.close();
		
		return JSON.serialize(table);
	}
}

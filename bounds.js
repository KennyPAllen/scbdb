var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('./bound.db'),
	databaseError = 'There was a problem retrieving data from the database';

module.exports = {
	getBounds: function (req, res) {
		var query = 'SELECT m.MapId AS bound_id, m.MapName AS bound_name, IFNULL(p.PlayerName, \'-\') AS creators, m.MapSize / 1024 AS size, m.MapFile AS file ' +
					'FROM Maps m ' +
					'INNER JOIN Players p ON mc.PlayerId = p.PlayerId ' +
					'LEFT JOIN MapCreators mc ON m.MapId = mc.MapId ' +
					'ORDER BY m.MapName COLLATE NOCASE, m.MapId, p.PlayerName COLLATE NOCASE;';
		
		db.all(query, function (err, rows) {
			if (err) {
				res.status(500).send('{"error":true,"message":"' + err + '"}');
			} else {
				var jsonResponse = '{"error":false,"bounds":[';
				
				rows.forEach (function (row, index) {
					if (index < rows.length - 1 && row.bound_id === rows[index + 1].bound_id) {
						rows[index + 1].creators = row.creators + ', ' + rows[index + 1].creators;
					} else {
						jsonResponse += JSON.stringify(row);
						
						if (index < rows.length - 1) {
							jsonResponse += ', ';
						}
					}
				});
				
				jsonResponse += ']}';
				res.status(200).send(jsonResponse);
			}
		});
	}
};
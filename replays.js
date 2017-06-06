var sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database('./bound.db'),
	databaseError = 'There was a problem retrieving data from the database';

module.exports = {
	getReplays: function (req, res) {
		var query = 'SELECT r.ReplayId AS replay_id, m.MapName AS bound_name, IFNULL(mo.ModeDescription, \'-\') AS mode, p.PlayerName AS players, REPLACE(TIME(r.ReplayTime, \'unixepoch\'), \'00:\', \'\') AS time, ' +
					'       DATE(r.ReplayDate, \'unixepoch\') as date, r.ReplaySize / 1024 as size ' +
					'FROM Replays r ' +
					'INNER JOIN Maps m ON r.MapId = m.MapId ' +
					'INNER JOIN ReplayPlayers rp ON r.ReplayId = rp.ReplayId ' +
					'INNER JOIN Players p ON rp.PlayerId = p.PlayerId ' +
					'LEFT JOIN ReplayModes rm ON r.ReplayId = rm.ReplayId ' +
					'LEFT JOIN Modes mo ON rm.ModeId = mo.ModeId ' +
					'ORDER BY m.MapName COLLATE NOCASE, r.ReplayTime, r.ReplayId, p.PlayerName COLLATE NOCASE;';
		
		db.all(query, function (err, rows) {
			if (err) {
				res.status(500).send('{"error":true,"message":"' + err + '"}');
			} else {
				var jsonResponse = '{"error":false,"replays":[';
				
				rows.forEach (function (row, index) {
					if (index < rows.length - 1 && row.replay_id === rows[index + 1].replay_id) {
						rows[index + 1].players = row.players + ', ' + rows[index + 1].players;
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
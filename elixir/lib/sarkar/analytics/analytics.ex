
defmodule Sarkar.Analytics do

	def record(school_id, client_id, changes, last_sync_date) do
		res = changes
			|> Enum.each(
				fn (%{"time" => time, "value" => %{"meta" => meta, "type" => type}}) -> 

					case Postgrex.query(Sarkar.School.DB,
						"INSERT INTO mischool_analytics ( school_id, value, time, type, client_id) VALUES ($1, $2, $3, $4, $5)",
					[school_id, meta, time, type, client_id]) do
					{:ok, resp} ->
						{:ok, resp}
					{:error, err} -> 
						IO.puts "ERROR PUTTING IN DB"
						IO.inspect err
					end
				end
			)
		IO.inspect res

		%{"type" => "CONFIRM_ANALYTICS_SYNC"}
	end
end
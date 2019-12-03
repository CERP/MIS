
defmodule Sarkar.Analytics do

	def add_writes(school_id, client_id, changes, last_sync_date) do

		{new_writes, last_date} = changes
		|> Enum.sort(fn({ _, %{"date" => d1}}, {_, %{"date" => d2}}) -> d1 < d2 end)
		|> Enum.reduce(
			{ %{}, 0 },
			fn({ path_key, payload}, {agg_new_writes, max_date}) ->
				
				%{
					"action" => %{
						"path" => path,
						"type" => type,
						"value" => value
					},
					"date" => date
				} = payload

				p_key = Enum.join(path, ",")

				write = %{
					"date" => date,
					"value" => value,
					"path" => path,
					"type" => type,
					"client_id" => client_id
				}

				case Map.get(agg_new_writes, p_key) do
					nil -> 
						{
							Map.put(agg_new_writes, p_key, write),
							max(date, max_date)
						}
					%{"date" => prev_date, "value" => prev_value} when prev_date < date ->
						{
							Map.put(agg_new_writes, p_key, write),
							max(date, max_date)
						}
					%{"date" => prev_date, "value" => prev_value} when prev_date >= date ->
						# IO.puts "#{school_id}: #{prev_date} is more recent than #{date}. current time is #{:os.system_time(:millisecond)}"
						# IO.inspect write
						{
							agg_new_writes,
							max_date
						}
					other -> 
						IO.puts "OTHER!!!!!!!!!!!!!"
						IO.inspect other
						{
							Map.put(agg_new_writes, p_key, write),
							max(date, max_date)
						}
				end
			end
		)

		case Sarkar.Store.School.save_writes(school_id,new_writes) do
			{:ok} ->
				%{"type" => "CONFIRM_ANALYTICS_SYNC"}
			{:err, err}->
				IO.inspect err
				{:err}
		end
	end
end
defmodule Sarkar.Application do
	# See https://hexdocs.pm/elixir/Application.html
	# for more information on OTP Applications
	@moduledoc false


	use Application

	def start(_type, _args) do
		# List all child processes to be supervised
		children = [
			{ Registry, keys: :duplicate, name: Sarkar.ConnectionRegistry },
			{ Registry, keys: :unique, name: Sarkar.SchoolRegistry },
			{ DynamicSupervisor, name: Sarkar.SchoolSupervisor, strategy: :one_for_one },
			{
				Postgrex,
					name: Sarkar.School.DB,
					hostname: System.get_env("POSTGRES_HOST") || "localhost",
					username: "postgres",
					password: System.get_env("POSTGRES_PASS") || "postgres",
					database: "postgres",
					port: System.get_env("POSTGRES_PORT") || "5432",
					types: Sarkar.PostgrexTypes,
					pool: DBConnection.Poolboy,
					pool_size: 10
			},
			:poolboy.child_spec(:image_worker, [
				{:name, {:local, :image_worker}},
				{:worker_module, Sarkar.Image.Worker},
				{:size, 5},
				{:max_overflow, 5}
			]),
			Sarkar.Server
		]

		# See https://hexdocs.pm/elixir/Supervisor.html
		# for other strategies and supported options
		opts = [strategy: :one_for_one, name: Sarkar.Supervisor]
		ret = Supervisor.start_link(children, opts)

		IO.inspect ret

	end
end

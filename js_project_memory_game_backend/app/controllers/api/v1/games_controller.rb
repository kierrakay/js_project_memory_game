class Api::V1::GamesController < ApplicationController

    def index
        @games= Game.all
        render json: @games
    end

    def create
   
        @game = Game.create(game_params)

        render json: @game
    end

    def destroy
        @game = Game.find_by(id: params[:id]).destroy
        render json: @game
    end

private

    def game_params
        params.require(:game).permit(:point, :time, :user_id)
    end

end
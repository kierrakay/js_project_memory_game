class Api::V1::GamesController < ApplicationController

    # gets all of users games to show in db?
    #then in front end have an area where user can get their last ten games and score or something using a get fetch
    def index
        @user = User.find_by(id: params[:user_id])
        @games= Game.all
        render json: @games
    end

    def create
        @user = User.find_by(id: params[:user_id])
        @game = Game.create(game_params)

        render json: @game
    end

    # def destroy
    #     @game = Game.find_by(id: params[:id]).destroy
    #     render json: @game
    # end

private

    def game_params
        params.require(:game).permit(:point, :time, :user_id)
    end

end
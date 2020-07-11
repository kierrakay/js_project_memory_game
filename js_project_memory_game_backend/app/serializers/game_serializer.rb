class GameSerializer < ActiveModel::Serializer
    attributes :id, :point, :time
    belongs_to :user
  end
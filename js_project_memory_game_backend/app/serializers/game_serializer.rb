class GameSerializer < ActiveModel::Serializer
    attributes :id, :points, :time
    belongs_to :user
  end
classdef bias_detector
    %UNTITLED6 Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        bias_memory
        
        predictions
        
        same_diff
    end
    
    methods
        function obj = bias_detector(bias_memory, same_diff)
            obj.bias_memory = bias_memory;
            obj.predictions = [];            
            obj.same_diff = same_diff;
        end
        
        function [obj, bot_play] = predict(obj, user_strokes, user_strokes_same_diff, turn_number)
            if turn_number == 1
                bot_play = 0;
            else
                if obj.same_diff == 0
                    if turn_number > obj.bias_memory
                        target = user_strokes(turn_number - obj.bias_memory : end);
                    else
                        target = user_strokes;
                    end
                    bot_play = mean(target);
                else
                    if turn_number > obj.bias_memory
                        target = user_strokes_same_diff(turn_number - obj.bias_memory : end);
                    else
                        target = user_strokes_same_diff;
                    end
                    bot_play = mean(target) * user_strokes(end);
                end                
            end
            obj.predictions = [obj.predictions; bot_play];
        end
        
        
    end
    
end


classdef pattern_detector
    %UNTITLED6 Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        pattern_length
        
        predictions
        
        same_diff
    end
    
    methods
        function obj = pattern_detector(pattern_length, same_diff)
            obj.pattern_length = pattern_length;
            obj.predictions = [];            
            obj.same_diff = same_diff;
        end
        
        function [obj, bot_play] = predict(obj, user_strokes, user_strokes_same_diff, turn_number)
            if turn_number <= obj.pattern_length
                bot_play = 0;
            else
                if obj.same_diff == 0
                    bot_play = pat_det(obj, user_strokes);
                else
                    bot_play = pat_det(obj, user_strokes_same_diff) * user_strokes(end);
                end                
            end
            obj.predictions = [obj.predictions; bot_play];
        end
        
        function bot_play = pat_det(obj, target)
            pat_grade=0;
            pat = target((end-obj.pattern_length+1):end);
            bot_play = pat(1);
            c=length(target)-obj.pattern_length;                
            while c>0
                pat = [pat(end), pat(1:(end-1))];
                if sum(abs(target(c:(c+obj.pattern_length-1)) - pat)) == 0
                    pat_grade = pat_grade+1;
                else
                    break;
                end
                c=c-1;
            end
            
            % score decision varies linearly between 0 to 2*pattern length
            pat_grade = min([pat_grade, 2*obj.pattern_length]) / (2*obj.pattern_length);  
            bot_play = bot_play * pat_grade;
        end
        
        
    end
    
end


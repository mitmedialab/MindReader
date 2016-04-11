classdef bot 
    %BOT player class
    %   Detailed explanation goes here
    
    properties
        bias_detectors
        bias_memories
        
        bias_detectors_same_diff
        bias_memories_same_diff
        
        pattern_detectors
        pattern_length
        
        pattern_detectors_same_diff
        pattern_length_same_diff
    end
    
    
    methods (Access = public)
        function bot = bot()
            bot.bias_memories = [5,10,15,20];
            for i = 1 : length(bot.bias_memories)
                bias_detectors(i) = bias_detector(bot.bias_memories(i), 0);
            end 
            bot.bias_detectors = bias_detectors;
            
            bot.bias_memories_same_diff = [5,10,15,20];
            for i = 1 : length(bot.bias_memories_same_diff)
                bias_detectors_same_diff(i) = bias_detector(bot.bias_memories_same_diff(i), 1);
            end 
            bot.bias_detectors_same_diff = bias_detectors_same_diff;
            
            
            
            bot.pattern_length = [2,3,4,5];
            for i = 1 : length(bot.pattern_length)
                pattern_detectors(i) = pattern_detector(bot.pattern_length(i), 0);
            end 
            bot.pattern_detectors = pattern_detectors;
            
            bot.pattern_length_same_diff = [2,3,4,5];
            for i = 1 : length(bot.pattern_length_same_diff)
                pattern_detectors_same_diff(i) = pattern_detector(bot.pattern_length_same_diff(i), 1);
            end 
            bot.pattern_detectors_same_diff = pattern_detectors_same_diff;            
            
        end
        
        
        function [bot, bot_move] = bot_play(bot, game)
            X = []; %the experts decisions (in +-1)
%             for i = 1 : length(bot.bias_memories)
%                 [bot.bias_detectors(i), p] = bot.bias_detectors(i).predict(game.user_strokes, game.user_strokes_same_diff, game.turn_number);
%                 X = [X, p];
%             end
%             for i = 1 : length(bot.bias_memories_same_diff)
%                 [bot.bias_detectors_same_diff(i), p] = bot.bias_detectors_same_diff(i).predict(game.user_strokes, game.user_strokes_same_diff, game.turn_number);
%                 X = [X, p];
%             end
%             for i = 1 : length(bot.pattern_length)
%                 [bot.pattern_detectors(i), p] = bot.pattern_detectors(i).predict(game.user_strokes, game.user_strokes_same_diff, game.turn_number);
%                 X = [X, p];
%             end
            for i = 1 : length(bot.pattern_length_same_diff)
                [bot.pattern_detectors_same_diff(i), p] = bot.pattern_detectors_same_diff(i).predict(game.user_strokes, game.user_strokes_same_diff, game.turn_number);
                X = [X, p];
            end
            
            qt = AggregateExperts(bot, X); 
            bot_move = 2*binornd(1, (qt+1)/2)-1; %translate to 0,1  and back to -1,1
        end
        
        function qt = AggregateExperts(bot, X)
            qt = mean(X);
        end
        
        

        
        function bot = temp(bot)
        
%              fprintf('\n');            
%              fprintf('\n');
%              fprintf('%d ', bot.user_likelihood_table);
             
             if bot.i > 3   %update grades
                state = [0,0,0];  % 0(1) -> won(lost),  same(diff),  won(lost)
                ind_map = [4,2,1];
                if bot.user_strokes(bot.i-3) ~= bot.bot_strokes(bot.i-3) %won
                    state(1) = 0;
                else
                    state(1) = 1;
                end
                
                if bot.user_strokes(bot.i-3) == bot.user_strokes(bot.i-2) %same
                   state(2) = 0;
                else
                   state(2) = 1;
                end
                
                if bot.user_strokes(bot.i-2) ~= bot.bot_strokes(bot.i-2) %won
                    state(3) = 0;
                else
                    state(3) = 1;
                end
                state_ind = sum(state.*ind_map)+1;
                
                if bot.user_strokes(bot.i-2) == bot.user_strokes(bot.i-1) %same
                    bot.user_likelihood_table(state_ind) = bot.user_likelihood_table(state_ind) + 1;
                else %diff
                    bot.user_likelihood_table(state_ind) = bot.user_likelihood_table(state_ind) - 1;
                end
             end
            
%              fprintf('\n');
             fprintf('%d ', bot.user_likelihood_table);
             
             likelihood = 0;
             likelihood_grade = 0;
            if bot.i > 2 %estimate for now
                state = [0,0,0];  % 0(1) -> won(lost),  same(diff),  won(lost)
                ind_map = [4,2,1];
                if bot.user_strokes(bot.i-2) ~= bot.bot_strokes(bot.i-2) %won
                    state(1) = 0;
                else
                    state(1) = 1;
                end
                
                if bot.user_strokes(bot.i-2) == bot.user_strokes(bot.i-1) %same
                   state(2) = 0;
                else
                   state(2) = 1;
                end
                
                if bot.user_strokes(bot.i-1) ~= bot.bot_strokes(bot.i-1) %won
                    state(3) = 0;
                else
                    state(3) = 1;
                end
                state_ind = sum(state.*ind_map)+1;
                
                if bot.user_likelihood_table(state_ind) >= 0  %same
                    likelihood = bot.user_strokes(bot.i-1);
                else
                    likelihood = ~bot.user_strokes(bot.i-1);
                end
                
                likelihood_grade = sum(abs(bot.user_likelihood_table)) / bot.i;
            end
            
            fprintf('  l: %d, l_G: %.1f    ', likelihood, likelihood_grade);

            
            
            [pat2_grade, pat2_next] = pattern_detector(bot, 2);
            [pat3_grade, pat3_next] = pattern_detector(bot, 3);
            [pat4_grade, pat4_next] = pattern_detector(bot, 4);
            
%            
            fprintf('  P2 g: %.1f n: %d  ', pat2_grade, pat2_next);
            fprintf('  P3 g: %.1f n: %d  ', pat3_grade, pat3_next);
            fprintf('  P4 g: %.1f n: %d  ', pat4_grade, pat4_next);
            
            
            if bot.i > 20
                t = bot.user_strokes(bot.i-20 : end);
            else
                t= bot.user_strokes;
            end
            u_m = mean(t);
            u_s = std(t);
            
            if isnan(u_s)
                u_s=1;
            end
            
            fprintf('std=%.1f ',u_s)
            if likelihood_grade > 0.1
                t = likelihood;
                fprintf('li %d ', state_ind);
            elseif pat4_grade > 2
                t = pat4_next;
                fprintf('pat4 ');
            elseif pat3_grade > 2
                t = pat3_next;
                fprintf('pat3 ');
            elseif pat2_grade > 3
                t = pat2_next;
                fprintf('pat2 ');                
            elseif u_s < 0.5
                t = u_m>0.5;
                fprintf('bias ');
            else
                t = randn(1)>0;
                fprintf('rand ');
            end
            bot.bot_strokes(bot.i) = t;
            
            %cheatting
            fprintf(' B: %d        ', t);
            
            
            
            
            
            
            
        end
        
    end
    
end




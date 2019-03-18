package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.Reducer.Context;
import org.apache.hadoop.util.*;

import edu.gatech.cse6242.Q4.DegreeReducer;
import edu.gatech.cse6242.Q4.DegreeMapper;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;
import java.util.StringTokenizer;

public class Q4 {

	public static class DegreeMapper
	extends Mapper<Object, Text, IntWritable, IntWritable>{

		private final static IntWritable one = new IntWritable(1);
		private final static IntWritable minusone = new IntWritable(-1);
		
		private IntWritable source = new IntWritable();
		private IntWritable target = new IntWritable();

		public void map(Object key, Text value, Context context
				) throws IOException, InterruptedException {
			StringTokenizer itr = new StringTokenizer(value.toString(), "\n");
			while (itr.hasMoreTokens()) {
				String line = itr.nextToken();
				String tokens[] = line.split("\t");

				source.set(Integer.parseInt(tokens[0]));
				target.set(Integer.parseInt(tokens[1]));
				
				context.write(source, one);
				context.write(target, minusone);
			}
		}
	}

	public static class DegreeReducer
	extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {
		private IntWritable result = new IntWritable();

		public void reduce(IntWritable key, Iterable<IntWritable> values,
				Context context
				) throws IOException, InterruptedException {
			int sum = 0;
			for (IntWritable val : values) {
				sum += val.get();
			}
			result.set(sum);
			context.write(key, result);
		}
	}
	
	  public static class DegreeToFrequencyMapper
	    extends Mapper<Object, Text, IntWritable, IntWritable>{

	    private final static IntWritable one = new IntWritable(1);
	    private IntWritable degree = new IntWritable();

	    public void map(Object key, Text value, Context context
	                    ) throws IOException, InterruptedException {
	      StringTokenizer itr = new StringTokenizer(value.toString(), "\n");
	      while (itr.hasMoreTokens()) {
	        String line = itr.nextToken();
	        String tokens[] = line.split("\t");

	        degree.set(Integer.parseInt(tokens[1]));
	        
	        context.write(degree, one);
	      }
	    }
	  }

	  public static class DegreeToFrequencyReducer
	       extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {
	    private IntWritable result = new IntWritable();

	    public void reduce(IntWritable key, Iterable<IntWritable> values,
	                       Context context
	                       ) throws IOException, InterruptedException {
	      int sum = 0;
	      for (IntWritable val : values) {
	        sum += val.get();
	      }
	      result.set(sum);
	      context.write(key, result);
	    }
	  }

	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job1 = Job.getInstance(conf, "Q4");

		job1.setJarByClass(Q4.class);
		job1.setMapperClass(DegreeMapper.class);
		job1.setCombinerClass(DegreeReducer.class);
		job1.setReducerClass(DegreeReducer.class);
		job1.setOutputKeyClass(IntWritable.class);
		job1.setOutputValueClass(IntWritable.class);

		FileInputFormat.addInputPath(job1, new Path(args[0]));
		FileOutputFormat.setOutputPath(job1, new Path("first_mapr"));
//		FileOutputFormat.setOutputPath(job1, new Path(args[1]));
		
		job1.waitForCompletion(Boolean.TRUE);
		
		Job job2 = Job.getInstance(conf, "job2");
	    //JobConf job2 = new JobConf(Q4.class);
	    //job2.setJobName("FrequencyCount");

	    job2.setJarByClass(Q4.class);
	    job2.setMapperClass(DegreeToFrequencyMapper.class);
	    job2.setCombinerClass(DegreeToFrequencyReducer.class);
	    job2.setReducerClass(DegreeToFrequencyReducer.class);
	    job2.setOutputKeyClass(IntWritable.class);
	    job2.setOutputValueClass(IntWritable.class);

	    FileInputFormat.addInputPath(job2, new Path("first_mapr"));
	    FileOutputFormat.setOutputPath(job2, new Path(args[1]));
	    System.exit(job2.waitForCompletion(true) ? 0 : 1);
	}
}
